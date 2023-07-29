// Requires Authenticated fetch - place into component or /confirmation page

const modifyWebhooks = async () => {
  const modifyResponse = await fetch('/api/modify-webhooks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
        hello: 'world'
      })
  })
}
window.modifyWebhooks = modifyWebhooks;