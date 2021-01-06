// /**
//  * Copyright 2020 Quantiphi, Inc. All Rights Reserved.
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *    http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */

"use strict";

/**
 * Default Welcome Intent controller
 * @param {object} df webhook fulfillment object
 */

const db = require("../../helper/dbconnectivity");
const getAdultCount = async (df) => {
    try{
    let contexts = df._request.queryResult.outputContexts;
    let agent = contexts.find(item => item.name.endsWith('/contexts/awaiting_service'));

    var child = agent.parameters["adult_count"][0];
    var adult = agent.parameters["child_count"][0];
    var rooms = Math.max(Math.ceil(child / 2), Math.ceil(adult / 2));
    var name = agent.parameters["hotel_name"];
    var type = agent.parameters["room_type"];
    let price;
    await db.collection('Hotels').where('name', '==', name).get()
        .then(async (snapshot) => {
            

            snapshot.forEach((doc) => {
                price = doc.data().price;
                console.log(doc.data().price)

            });


        });

    price*=rooms;


    df.setResponseText("The price for " + adult + "adults and " + child + " children is: " + price);
    df.setResponseText("do you want to book this room?");
    }
    catch(err)
    {
        console.log(err);
    }
};

module.exports = getAdultCount;

