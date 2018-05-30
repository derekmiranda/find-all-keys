# find-all-keys utility

Similar to Lodash Object find function, except returns all instances where predicate either equals recursively found values or predicate function evaluates to a truthy value when current value is passed in.

## NOTE

Uses ES6 WeakMap object to store object references