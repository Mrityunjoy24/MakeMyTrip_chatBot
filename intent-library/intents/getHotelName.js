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
const getHotelName = async (df) => {
    try {
        let contexts = df._request.queryResult.outputContexts;
        let item = contexts.find(item => item.name.endsWith('/contexts/awaiting_service'));
        let city = item.parameters.destination_city;
        let Hotel = item.parameters.hotel_name;
        //let roomType = item.parameters.Room_type;

        const carsRef = db.collection('Hotels');
        const queryRef = await carsRef.where('city', '==', city).where('name', '==', Hotel).get();
        let h = new Set();
        let room = [];

        queryRef.forEach(doc => {
            room.push({
                type: doc.data().type,
                price: doc.data().price
            })
        });

        let str = "Available Rooms are : ";
        df.setResponseText(str);
        let i = 1;
        room.forEach(element => {
            df.setResponseText(i + ". " + element.type + ": "+element.price);
            i++;
        })

        df.setResponseText(" select room type");

    }
    catch (err) {
        console.log(err);
    }



};

module.exports = getHotelName;

