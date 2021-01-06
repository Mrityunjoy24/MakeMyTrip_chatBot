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
const getCarDuration = async (df) => {
    //console.log(df);
    //console.log(c.cost);

    //let carBrand=df.queryResult.outputContexts
    let contexts = df._request.queryResult.outputContexts;
    let agent = contexts.find(item => item.name.endsWith('/contexts/awaiting_service'));
    var email = agent.parameters["email"];
    let carBrand = agent.parameters["cars_brand"];
    let carType = agent.parameters["Car_Type"];
    let carDur = agent.parameters.duration.amount;

    const carsRef = db.collection('Cars');
    const queryRef = await carsRef.where('brand', '==', carBrand).where('type', '==', carType).get();

    let price;

    queryRef.forEach(doc => {
        console.log(doc.data());
        price = doc.data().price;
    });

    let cost = price * carDur;

    df.setResponseText("Got it. \n Your total payment is: Rs " + cost + " \n Do want to  book this car? (yes/No)");
};

module.exports = getCarDuration;

