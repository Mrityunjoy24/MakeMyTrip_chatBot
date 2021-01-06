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

const hotelBookingYes = async (df) => {
    try{
    let contexts = df._request.queryResult.outputContexts;
    let agent = contexts.find(item => item.name.endsWith('/contexts/awaiting_service'));
    var email = agent.parameters["email"];
    var child = agent.parameters["adult_count"][0];
    var adult = agent.parameters["child_count"][0];
    var rooms = Math.max(Math.ceil(child / 2), Math.ceil(adult / 2));
    var name = agent.parameters["hotel_name"];
    var type = agent.parameters["room_type"];
    let price = 0;
    await db.collection('Hotels').where('name', '==', name).get()
        .then(async (snapshot) => {

            snapshot.forEach((doc) => {
                price= doc.data().price;

            });

    });

    let total_price=price*rooms;

    var summary="Hotel Booking Summery:"+name+" "+type+""+"price: "+price+" total payable amount:"+total_price+" "+
        +child+" children "+adult+" adult";
    await db.collection("users").doc(email).update({
          'hotel': summary,
          'hotel_price':total_price
   });
    df.setResponseText(summary);
    df.setResponseText("Do you want to book cars?")
    }
    catch(err)
    {
        console.log(err);
    }
    
};

module.exports = hotelBookingYes;

