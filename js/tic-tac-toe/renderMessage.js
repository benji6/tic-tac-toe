const messsageEl = document.getElementById('message_container')
const renderMessage = message => messsageEl.innerHTML = `<div class="center">${message}</div>`

module.exports = {
  draw: () => renderMessage('Draw'),
  victory: winner => renderMessage(`Victory for ${winner}!`),
}
