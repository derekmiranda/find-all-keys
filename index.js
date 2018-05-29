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
const _seenObjs = new Map()

function findAllKeys(obj, predicate) {
	return _searchObj(obj, predicate)
}

function _searchObj(obj, predicate, baseKey = '') {
	// mark obj as seen
	_seenObjs.set(obj, true)
	
	const keys = Object.keys(obj)
	let matchingKeys = []
	
	for (const key of keys) {
		const val = obj[key]
		
		if (typeof val === 'object' && _seenObjs.has(val)) {
			continue
		}
		
		const keyStr = baseKey ? `${baseKey}.${key}` : key
		if (typeof predicate === 'function' && predicate(val)) {
			matchingKeys.push(keyStr)
		} else if (val === predicate) {
			matchingKeys.push(keyStr)
		} else if (typeof val === 'object') {
			const recursivelyFoundKeys = _searchObj(val, predicate, keyStr)

			if (recursivelyFoundKeys) {
				matchingKeys = matchingKeys.concat(recursivelyFoundKeys)
			}
		}
	}
	
	return matchingKeys.length ? matchingKeys : undefined
}

module.exports = findAllKeys
