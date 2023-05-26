import mercadopago from 'mercadopago'
import {HOST, MERCADOPAGO_TOKEN} from '../config.js'

export const createOrder = async (req, res) => {
  // Crea una orden de pago
  mercadopago.configure({
    access_token: MERCADOPAGO_TOKEN
  })

  const result = await mercadopago.preferences.create({
    items: [
      {
      title: "Mi producto",
      unit_price: 500,
      currently_id: "PEN",
      quantity: 1,
    }
  ],
  back_urls: {
    success:`${HOST}/success`,
    failure:`${HOST}/failure`,
    pending:`${HOST}/pending`
  },
  notification_url: "https://21a3-45-174-150-98.sa.ngrok.io/webhook"
  })

  console.log(result)
  res.send(result.body)
}

export const receiveWebhook = async (req, res) => {
  console.log(req.query)

  const payment = req.query

  try {
    if(payment.type === "payment") {
      const data = await mercadopago.payment.findById(payment['data.id'])
      console.log(data)
    }
    res.sendStatus(204)
  } catch(err) {
    console.log(err)
    return res.sendStatus(500).json({error: err.message})
  }

}