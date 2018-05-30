import test from 'ava'
import findAllKeys from './index'

test('Returns matching keys of top-level values', t => {
	const obj = {
		a: 1,
		b: 2,
		c: 1
	}
	t.deepEqual(findAllKeys(obj, 1), ['a', 'c'])
})

test("Returns undefined if can't find val", t => {
	const obj = {
		a: 1,
		b: 2,
		c: 1
	}
	t.is(findAllKeys(obj, 3), undefined)
})

test("Matches keys by predicate function", t => {
	const obj = {
		a: 1,
		b: 2,
		c: -1
	}
	const pred = n => n < 0
	t.deepEqual(findAllKeys(obj, pred), ['c'])
})

test("Looks recursively thru objects w/ predicate function", t => {
	const obj = {
		a: 1,
		b: 2,
		c: {
			d: 3,
			e: {
				f: 5
			}
		}
	}
	const isOdd = n => n % 2
	t.deepEqual(findAllKeys(obj, isOdd), ['a', 'c.d', 'c.e.f'])
})

test("Prevents looping if finds circular reference", t => {
	const a = { c: 3 }
	const b = { a }
	a.b = b

	t.deepEqual(findAllKeys(a, 3), ['c'])
})

test("Doesn't recurse into null val", t => {
	const a = { b: 1, c: null }

	t.notThrows(() => {
		const keys = findAllKeys(a, 1)
		t.deepEqual(keys, ['b'])
	})
})

test("Formats non-standard object keys differently", t => {
	const a = {
		'non.standard': 1
	}

	t.deepEqual(findAllKeys(a, 1), ['["non.standard"]'])
})