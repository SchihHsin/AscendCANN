const EXPLANATION_INTENT = /为什么|怎么理解|帮我.{0,4}理解|想理解|理解一下|解释|说明|讲解|讲一下|怎么回事|看不懂|\bwhy\b|\bexplain\b|\bhow does\b|\bhow do\b|\bwhat causes\b/i;
const REVIEW_INTENT = /应用(?!后|的|过)|采用(?!的|后|过)|接受建议|修改建议|(?:看|查看|预览|审阅|对照).{0,6}diff|\bdiff\b|\breview(?:\s+(?:the\s+)?(?:change|diff|suggestion))?\b|\bpreview\b|\bapply\b|\baccept(?:\s+(?:the\s+)?(?:change|suggestion))?\b/i;
const CHECK_INTENT = /核对|检查|验证|确认是否|是否符合|\bcheck\b|\bvalidate\b|\bverify\b/i;
const CHECK_DIRECTIVE = /(?:帮(?:我)?|请|重新|再(?:次)?|去|开始|立即|直接).{0,5}(?:核对|检查|验证|check|validate|verify)|(?:核对|检查|验证)(?:一下|下)|\b(?:please\s+(?:check|validate|verify)|help me\s+(?:check|validate|verify)|recheck|check again|start checking)\b/i;
const TRY_INTENT = /试一下|试试|试改|调参数|尝试|探索|\btry\b|\bexplore\b/i;
const TRY_DIRECTIVE = /(?:帮(?:我)?|请|直接|开始).{0,5}(?:试一下|试试|试改|调参数|尝试|探索|try|explore)|(?:试一下|试试|试改|调参数)(?:看看|一下)?|\b(?:please\s+)?(?:try|explore)\b/i;
const FAILURE = /报错|错误|失败|不对|异常|超出范围|\berror\b|\bfail(?:ed|ure)?\b|\bwrong\b|\bincorrect\b|\bbroken\b/i;
const DIAGNOSE_INTENT = /报错|错误|失败|修复|诊断|排查|\berror\b|\bfail(?:ed|ure)?\b|\bfix\b|\bdebug\b/i;

function removeDeniedActions(text) {
  return text
    .replace(/((?:但(?:是)?|只|而是|改为)(?:先|请|帮我)?(?:解释|讲解|理解|说明|检查|核对|验证|试改|审阅))/g, ",$1")
    .replace(/(?:先别|暂不|暂时不|还没|尚未|不需要|无需|不要|不想|别|不)(?:去|再|先)?\s*(?:修改|应用|采用|接受|检查|核对|验证|试改|尝试|理解|解释|说明|讲解|修复|诊断|预览|审阅|查看|调参)[^，。；;.!?！？\n]*/g, " ")
    .replace(/\b(?:don't|do not|doesn't|didn't|not yet|no need to|without)\s+(?:to\s+)?(?:modify|change|apply|accept|check|validate|verify|try|explore|understand|explain|review|preview|fix|debug|diagnose)\b[^,.!?;\n]*/gi, " ");
}

function withoutCompletedContext(text) {
  return text
    .replace(/(?:已经|已|刚刚|此前|之前|曾经)\s*(?:应用|采用|修改)(?:过|了)?/g, " ")
    .replace(/(?:应用|采用|修改)后的/g, " ")
    .replace(/\b(?:already\s+)?(?:applied|adopted|accepted|modified)\b/gi, " ");
}

/** Classify an explicit task-learning request while treating failures and completed actions as context. */
export function classifyTaskIntent(text) {
  const source = typeof text === "string" ? text : "";
  const actionableText = removeDeniedActions(source);
  const activeText = withoutCompletedContext(actionableText);

  // Understanding questions keep their diagram context even when they mention actions.
  if (EXPLANATION_INTENT.test(actionableText)) return "explain";
  // A direct request to check wins over words describing an already-applied change.
  if (CHECK_DIRECTIVE.test(activeText)) return "check";
  if (REVIEW_INTENT.test(activeText) && !FAILURE.test(activeText)) return "review";
  if (TRY_DIRECTIVE.test(activeText)) return "try";

  // A reported failure is diagnosis unless the user explicitly asked for a check above.
  if (FAILURE.test(activeText) || DIAGNOSE_INTENT.test(activeText)) return "diagnose";
  if (REVIEW_INTENT.test(activeText)) return "review";
  if (CHECK_INTENT.test(activeText)) return "check";
  if (TRY_INTENT.test(activeText)) return "try";
  return "none";
}

/** Pick the diagram focus from explicit bilingual terms; otherwise use the agreed defaults. */
export function getExplanationFocus(text, imageTask = false) {
  const source = typeof text === "string" ? text : "";

  if (imageTask) {
    if (/通道|\bchannels?\b|\bRGB\b|\bBGR\b/i.test(source)) return "channels";
    if (/批次|批量|\bbatch(?:\s*size)?\b/i.test(source)) return "batch";
    if (/布局|维度顺序|转置|\blayout\b|\bNCHW\b|\bNHWC\b|\bCHW\b|\bHWC\b/i.test(source)) return "layout";
    return "layout";
  }

  if (/尾块|尾部|最后一块|边界块|剩余元素|非整除|\btail\b|\bremainder\b/i.test(source)) return "tail";
  if (/结构|分块|块数|总块|\bshape\b|\bgrid\b|\bblockDim\b/i.test(source)) return "structure";
  if (/访问|索引|偏移|范围|越界|读写|\baccess\b|\bbounds?\b|\boffset\b|\bindex(?:ing)?\b/i.test(source)) return "access";
  return "tail";
}
