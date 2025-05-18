const PORT = 8000
const express = require('express')
const app = express()
const uuid4 = require('uuid4')
const cors = require('cors')
const sdk = require('node-appwrite')
app.use(cors())
app.use(express.json())


const client = new sdk.Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')  //API Endpoint
    .setProject('6828d4740032f7814d30')   //Project ID
    .setKey('standard_da8cfb6011e771f5b80fa127ee8fc219b8bd4f2e63360bab0ff61023622e945bf7cf0ad7669d351e3798e35288f62ac44dc6fc617b78655d0605df421529cf92fe59aef60bd7a2ec1b159730380b9142e3b071bd37e9b987d64852ef7f1e654995aa7048244791d73209c5ccf55bd4be7caf24ef1fc81fbf76eae728c54ff6e0')       //Secret API KEY

const messaging = new sdk.Messaging(client)
const users = new sdk.Users(client)

app.post('/register', async (req, res) => {
    try {
        const user = req.body
        const id = uuid4()

        const result = await users.create(
            id, //userId
            user.email, //email (optional)
            user.tel   //telephone (optional)
        )
        console.log(result)

        if(result) {
            await sendEmail(result)
            await sendSMS(result)
        }

    } catch (error) {
        console.error(error)
    }
} )

const sendEmail = async (result) => {
    const id = uuid4()
    const email = result.email
    const userId = result['$id']

    const message = await messaging.createEmail(
        id, //messageId
        `Welcome! ${email}`, //subject
        'Thank you so much for signing up! We welcome you to our email community', //content
        [], //topics(optional)
        [userId] //users (optional)
    )
    console.log(message)
}

const sendSMS = async (result) => {
    const id = uuid4()
    const userId = result['$id']

    const message = await messaging.createSms(
        id,  //messageId
        'Thank you so much for signing up! We welcome you to our SMS community', //content
        [], //topics(optional)
        [userId] //users (optional)
    )
    console.log(message)
}

app.listen(PORT, () => console.log(`Server running on ${PORT}`))
