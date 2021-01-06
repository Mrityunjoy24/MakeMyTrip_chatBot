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
const getHotelBooking = async (df) => {
    try {
        let contexts = df._request.queryResult.outputContexts;
        let item = contexts.find(item => item.name.endsWith('/contexts/awaiting_service'));
        let city = item.parameters.destination_city;

        const carsRef = db.collection('Hotels');
        const queryRef = await carsRef.where('city', '==', 'Mumbai').get();
        let h = new Set();
        let p = new Set();
        let hotel = [];

        

        queryRef.forEach(doc => {
            console.log(doc.data());
            h.add(doc.data().name);
            p.add(doc.data().starting_price)

        });

        //let cost = price * carDur;

        let ho = Array.from(h);
        let pr = Array.from(p);
        let str = "Available Hotels are : ";
        df.setResponseText(str);
        let i = 1;
        ho.forEach(element => {
            console.log(pr[i-1]);
            df.setResponseText(i + ". " + element + " starting_price: "+pr[i-1]);
            i++;
        })

        df.setResponseText(" select Hotel");

    }
    catch (err) {
        console.log(err);
    }



};

module.exports = getHotelBooking;

