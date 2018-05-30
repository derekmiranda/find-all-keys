/**
 * Similar to Lodash Object find function, except returns all instances
 * where predicate either equals recursively found values
 * or predicate function evaluates to a truthy value when current value is passed in.
 * 
 * returns Array of matching keys
 * obj: Object
 * predicate: Any (match by value) / Function (value matches if predicate evals to truthy)
 */

// cache to prevent revisiting seen keys

function findAllKeys(obj, predicate) {
	const _seenObjs = new WeakMap()
	return _searchObj(obj, predicate, _seenObjs)
}

function accountForUnusualKeys(key) {
	const isUnusual = /\W/.test(key)
	if (isUnusual) {
		// escape any double-quotes
		key = key.replace(/"/g, '\\"')
		return `["${key}"]`
	}
	return key
}

function processKey(key, baseKey = '') {
	const isUnusual = /\W/.test(key)
	const isNum = /^\d+$/.test(key)
	if (isUnusual) {
		// escape any double-quotes
		key = key.replace(/"/g, '\\"')
		return `${baseKey}["${key}"]`
	} else if (isNum) {
		return `${baseKey}[${key}]`
	}
	return baseKey ? `${baseKey}.${key}` : key
}

function _searchObj(obj, predicate, _seenObjs, baseKey = '') {
	// mark obj as seen
	_seenObjs.set(obj, true)
	
	const keys = Object.keys(obj)
	let matchingKeys = []
	
	for (let key of keys) {
		const val = obj[key]
		
		if (typeof val === 'object' && _seenObjs.has(val)) {
			continue
		}
		
		const keyStr = processKey(key, baseKey)
		if (typeof predicate === 'function' && predicate(val)) {
			matchingKeys.push(keyStr)
		} else if (val === predicate) {
			matchingKeys.push(keyStr)
		} else if (val && typeof val === 'object') {
			const recursivelyFoundKeys = _searchObj(val, predicate, _seenObjs, keyStr)

			if (recursivelyFoundKeys) {
				matchingKeys = matchingKeys.concat(recursivelyFoundKeys)
			}
		}
	}
	
	return matchingKeys.length ? matchingKeys : undefined
}

module.exports = findAllKeys
