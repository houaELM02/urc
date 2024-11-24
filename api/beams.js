import {getConnecterUser, triggerNotConnected} from "../lib/session.js";

//const PushNotifications = require("@pusher/push-notifications-server");
import PushNotifications from "@pusher/push-notifications-server";


export default async (req, res) => {
    console.log('start notification')

    const userIDInQueryParam = req.query["user_id"];
    const user = await getConnecterUser(req);

    if (user === undefined || user === null || userIDInQueryParam !== user.externalId) {
        triggerNotConnected(res);
        return;
    }   
    console.log("notificationnn")

    //console.log("IncenceId "+process.env.PUSHER_INSTANCE_ID);
    //console.log("secretKey " + process.env.PUSHER_SECRET_KEY);


    //const instanceId = process.env.PUSHER_INSTANCE_ID;
    //const secretKey =process.env.PUSHER_SECRET_KEY;
    
        const beamsClient = new PushNotifications({
            instanceId: '272a3cc0-cb19-4554-bab7-758a2ee42882',
            secretKey: '9A864F59041C1C26BCC49CF3187DB651B6651073AE72C27E0362E1C956B60D4A',
        });

        const beamsToken = beamsClient.generateToken(user.externalId);
        console.log("token value",beamsToken)
        res.send(beamsToken);
       
};
