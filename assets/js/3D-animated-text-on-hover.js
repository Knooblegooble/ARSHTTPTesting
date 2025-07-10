const body = document.body
const boundingClientRect = body.getBoundingClientRect()

body.onmousemove = function(e) {

	const x = e.clientX - boundingClientRect.left
	const y = e.clientY - boundingClientRect.top
	
	const xc = boundingClientRect.width / 2
	const yc = boundingClientRect.height / 2
	
	const dx = (x - xc) / 5
	const dy = y - yc
	
	body.style.setProperty('--x', -dx / 10 + 'px')
	body.style.setProperty('--y', -dy / 50 + 'px')
	
}