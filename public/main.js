const B = a => b => c => a(b(c))
const Y = a => (b => b(b))(b => a(c => b(b)(c)))

const zero = () => x => x
const one = f => x => f(x)
const two = f => x => f(f(x))

const pair = a => b => c => c(a)(b)
const first = a => a(b => () => b)
const second = a => a(() => b => b)

const True = a => () => a
const False = () => a => a
const If = a => b => c => a(b)(c)

const nil = pair(True)(True)
const isNil = first
const cons = a => b => pair(False)(pair(a)(b))
const head = a => first(second(a))
const tail = a => second(second(a))
const foldr = Y(r => f => a => xs => If(isNil(xs))(() => a)(() => f(head(xs))(r(f)(a)(tail(xs))))())
const foldl = f => a => xs => foldr(x => g => y => g(f(y)(x)))(x => x)(xs)(a)
const nth = n => xs => head(n(tail)(xs))

const board = cons(cons(zero)(cons(one)(cons(two)(nil))))(cons(cons(zero)(cons(one)(cons(two)(nil))))(cons(cons(zero)(cons(one)(cons(two)(nil))))(nil)))

// IO below

const encodeNumber = n => f => x => {
  const g = (m, y) => m === 0 ? y : g(m - 1, f(y))
  return g(n, x)
}

const decodeNumber = a => a(b => b + 1)(0)
const numberToChar = n => n === 0 ? '' : n === 1 ? 'o' : 'x'
const char = B(numberToChar)(decodeNumber)

const rowToHtml = foldl(acc => val => acc + `<div class=${char(val)}></div>`)('')

const html = foldl(acc => val => acc + rowToHtml(val))('')(board)

const handleInput = coords => {
  console.log('char', char(nth(second(coords))(nth(first(coords))(board))))
}

document.getElementById('board').innerHTML = html
;([...(document.querySelectorAll('#board div'))]).forEach((el, i) => {
  el.onclick = () => handleInput(pair(encodeNumber(Math.floor(i / 3)))(encodeNumber(i % 3)))
})
