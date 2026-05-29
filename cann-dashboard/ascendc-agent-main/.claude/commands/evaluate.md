---
description: Evaluate the complexity of operator development processes using the [evaluation agent](../agents/evaluator.md)
---

## Usage

```bash
/evaluate [operator_name]
```

or

```bash
/evaluate [user specified log file]
```

## Description

This command launches the complexity evaluation agent to analyze the development process of Huawei CANN Ascend C operators. 

## Examples

```bash
# Evaluate a user specified operator developing log file
/evaluate ./logs/[log_file_name].md

# Evaluate a single operator
/evaluate add_custom
```

## Parameters

- **operator_developing_log_file**: Log file to evaluate
- **operator_name**: Name of the operator to evaluate (must exist in `logs/` directory)