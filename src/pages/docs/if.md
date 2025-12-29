---
layout: "@/layouts/docsLayout.astro"
title: 'If statements'
---

# If statements

If statements are used to control the flow of logic in a script. 
It is important to note that they return a value, and thus can be
used as the return value of a function.

### Lambda Calculus representation
`
@bxy.b x y
`

### Usage

``
if ([condition]) {
    [multiline expression]
} else {
    [multiline expression]
}
``

Alternatively, either multiline expression can be replaced by a single expression.


`if ([condition]) [value] else { [multiline expression] }`

`if ([condition]) { [multiline expression] } else [value]`

`if ([condition])  [value] else [value]`


### Example

### See also

- [guard](/docs/guard)
- [IF](/docs/if_function)
