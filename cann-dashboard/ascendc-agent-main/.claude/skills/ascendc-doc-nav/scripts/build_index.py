#!/usr/bin/env python3
"""
Ascend C 文档索引生成脚本

功能：
1. 解析 bookmap.md 文件
2. 生成结构化 JSON 索引
3. 包含：分类索引、API 名称索引、关键词索引

使用方法：
    python build_index.py
"""

import json
import re
import os
from pathlib import Path
from typing import Dict, List, Set


def parse_bookmap(bookmap_path: str) -> Dict:
    """
    解析 bookmap.md 文件生成结构化索引

    Args:
        bookmap_path: bookmap 文件路径

    Returns:
        结构化索引字典
    """
    with open(bookmap_path, 'r', encoding='utf-8') as f:
        content = f.read()

    index = {
        "metadata": {
            "version": "1.0",
            "source": "zh-cn_bookmap_0000002534484153.md",
            "description": "Ascend C 算子开发指南文档索引"
        },
        "categories": {},      # 分类索引
        "api_index": {},       # API 名称 -> 文档路径
        "keyword_index": {},   # 关键词 -> 文档路径
        "doc_tree": []         # 完整文档树
    }

    lines = content.split('\n')
    current_path = []  # 当前路径栈
    last_level = -1

    # API 关键词映射
    api_keywords = {
        # 矢量计算 - 基础算术
        'Add': ['加法', '矢量加', '相加'],
        'Sub': ['减法', '矢量减', '相减'],
        'Mul': ['乘法', '矢量乘', '相乘'],
        'Div': ['除法', '矢量除', '相除'],
        'Exp': ['指数', 'e的幂'],
        'Ln': ['自然对数', 'log'],
        'Sqrt': ['平方根', '开方'],
        'Rsqrt': ['倒数平方根'],
        'Abs': ['绝对值'],
        'Reciprocal': ['倒数'],
        'Relu': ['激活函数', 'relu'],
        'Max': ['最大值'],
        'Min': ['最小值'],
        'LeakyRelu': ['带泄露relu'],

        # 矢量计算 - 归约
        'ReduceSum': ['求和', '归约求和', '累加'],
        'ReduceMax': ['最大值归约'],
        'ReduceMin': ['最小值归约'],
        'WholeReduceSum': ['全归约求和'],
        'BlockReduceSum': ['块归约求和'],

        # 数据搬运
        'DataCopy': ['数据拷贝', '数据搬运', '内存拷贝'],
        'Copy': ['拷贝'],

        # 资源管理
        'TPipe': ['管道', '流水线'],
        'TQue': ['队列', 'queue'],
        'TBuf': ['缓冲区', 'buffer'],
        'AllocTensor': ['分配tensor'],
        'FreeTensor': ['释放tensor'],
        'EnQue': ['入队'],
        'DeQue': ['出队'],

        # 同步控制
        'PipeBarrier': ['管道屏障', '同步'],
        'SyncAll': ['全同步'],
        'SetFlag': ['设置标志'],
        'WaitFlag': ['等待标志'],

        # 类型转换
        'Cast': ['类型转换', '数据类型转换'],

        # 系统变量
        'GetBlockNum': ['获取块数', '核数'],
        'GetBlockIdx': ['获取块索引', '核索引'],

        # 高阶API
        'SoftMax': ['softmax', '归一化指数'],
        'LayerNorm': ['层归一化', 'layernorm'],
        'Matmul': ['矩阵乘法', '矩阵乘'],
        'TopK': ['topk', '前k个'],

        # 数据结构
        'LocalTensor': ['本地张量', '局部张量'],
        'GlobalTensor': ['全局张量'],
    }

    # 分类映射
    category_map = {
        '入门教程': 'tutorial',
        '编程指南': 'programming_guide',
        '算子实践参考': 'practice',
        'API参考': 'api_reference',
        '基础数据结构': 'data_structures',
        '基础API': 'basic_api',
        '高阶API': 'advanced_api',
        'Utils API': 'utils_api',
    }

    def get_category_from_path(path: List[str]) -> str:
        """从路径获取分类"""
        for cat_name, cat_id in category_map.items():
            if cat_name in path:
                return cat_id
        return 'other'

    def extract_title(line: str) -> tuple:
        """从行中提取标题和路径"""
        # 匹配 [标题](路径.md) 格式
        match = re.match(r'^(\s*)-?\s*\[([^\]]+)\]\(([^)]+)\)', line.strip())
        if match:
            indent = match.group(1)
            title = match.group(2)
            link = match.group(3)
            level = len(indent) // 4  # 根据缩进计算层级
            return level, title, link
        return None, None, None

    def add_to_index(title: str, path: str, full_path: List[str]):
        """添加到索引"""
        # API 索引
        clean_title = title.replace('（ISASI）', '').replace('（废弃）', '').strip()
        if clean_title not in index['api_index']:
            index['api_index'][clean_title] = []
        index['api_index'][clean_title].append('/'.join(full_path))

        # 关键词索引
        title_lower = clean_title.lower()
        for word in re.findall(r'[A-Za-z]+', title):
            if len(word) > 1:
                if word not in index['keyword_index']:
                    index['keyword_index'][word] = []
                index['keyword_index'][word].append('/'.join(full_path))

        # 添加预定义关键词
        if clean_title in api_keywords:
            for kw in api_keywords[clean_title]:
                if kw not in index['keyword_index']:
                    index['keyword_index'][kw] = []
                index['keyword_index'][kw].append('/'.join(full_path))

    # 解析 bookmap
    for line in lines:
        if not line.strip() or not line.strip().startswith('-'):
            continue

        level, title, link = extract_title(line)
        if title is None:
            continue

        # 更新当前路径
        if level <= last_level:
            # 回退到正确的层级
            current_path = current_path[:level]
        current_path.append(title)
        last_level = level

        # 构建完整路径
        full_path = current_path.copy()

        # 分类
        category = get_category_from_path(full_path)
        if category not in index['categories']:
            index['categories'][category] = []
        index['categories'][category].append({
            'title': title,
            'path': '/'.join(full_path),
            'link': link
        })

        # 添加到索引
        add_to_index(title, link, full_path)

    # 构建文档树（简化版）
    index['doc_tree'] = build_doc_tree(content)

    return index


def build_doc_tree(content: str) -> List[Dict]:
    """构建简化的文档树结构"""
    tree = []
    lines = content.split('\n')
    # 栈存储 (父列表, 层级)
    stack = [(tree, -1)]

    for line in lines:
        if not line.strip() or not line.strip().startswith('-'):
            continue

        level, title, link = extract_title_info(line)
        if title is None:
            continue

        node = {
            'n': title,  # name
            'p': link    # path
        }

        # 回退到正确的父级
        while len(stack) > 1 and stack[-1][1] >= level:
            stack.pop()

        # 添加到当前父列表
        stack[-1][0].append(node)

    return tree


def extract_title_info(line: str) -> tuple:
    """从行中提取标题信息"""
    # 匹配 [标题](路径.md) 格式
    match = re.search(r'\[([^\]]+)\]\(([^)]+)\)', line)
    if match:
        title = match.group(1)
        link = match.group(2)
        # 计算缩进层级
        indent = len(line) - len(line.lstrip())
        level = indent // 4
        return level, title, link
    return None, None, None


def generate_compact_index(index: Dict) -> Dict:
    """生成精简版索引用于 SKILL.md 内嵌"""
    compact = {
        "categories": {},
        "common_apis": []
    }

    # 常用 API 列表
    common_apis = [
        # 矢量计算
        'Add', 'Sub', 'Mul', 'Div', 'Exp', 'Ln', 'Sqrt', 'Abs',
        'ReduceSum', 'ReduceMax', 'ReduceMin',
        'Cast', 'Compare', 'Select',
        # 数据搬运
        'DataCopy', 'Copy',
        # 资源管理
        'TPipe', 'TQue', 'TBuf', 'AllocTensor', 'FreeTensor',
        # 同步
        'PipeBarrier', 'SyncAll',
        # 系统
        'GetBlockNum', 'GetBlockIdx',
        # 数据结构
        'LocalTensor', 'GlobalTensor',
    ]

    compact['common_apis'] = [
        {'name': api, 'paths': index['api_index'].get(api, [])}
        for api in common_apis
        if api in index['api_index']
    ]

    # 分类路径映射（精简版）
    compact['categories'] = {
        'vector': '04-API参考/基础API/矢量计算',
        'data_copy': '04-API参考/基础API/数据搬运',
        'resource': '04-API参考/基础API/资源管理',
        'sync': '04-API参考/基础API/同步控制',
        'high_level': '04-API参考/高阶API',
        'tutorial': '01-入门教程',
        'guide': '02-编程指南',
        'practice': '03-算子实践参考',
    }

    return compact


def main():
    """主函数"""
    # 获取脚本所在目录
    script_dir = Path(__file__).parent
    skill_dir = script_dir.parent
    project_root = skill_dir.parent.parent.parent

    # 输入输出路径
    bookmap_path = project_root / 'AscendC算子开发指南' / 'zh-cn_bookmap_0000002534484153.md'
    output_path = skill_dir / 'references' / 'doc-index.json'
    compact_path = skill_dir / 'references' / 'doc-index-compact.json'

    print(f"解析 bookmap: {bookmap_path}")
    print(f"输出索引: {output_path}")

    # 解析并生成索引
    index = parse_bookmap(str(bookmap_path))

    # 保存完整索引
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
    print(f"已生成完整索引: {output_path}")

    # 生成并保存精简索引
    compact = generate_compact_index(index)
    with open(compact_path, 'w', encoding='utf-8') as f:
        json.dump(compact, f, ensure_ascii=False, indent=2)
    print(f"已生成精简索引: {compact_path}")

    # 打印统计信息
    print(f"\n索引统计:")
    print(f"  - 分类数: {len(index['categories'])}")
    print(f"  - API 索引条目: {len(index['api_index'])}")
    print(f"  - 关键词索引条目: {len(index['keyword_index'])}")


if __name__ == '__main__':
    main()
