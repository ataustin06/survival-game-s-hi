export default class Start extends Phaser.Scene
{
    constructor ()
    {
        super('Start');
    }

    preload () {}

    create ()
    {
        this.cameras.main.setBackgroundColor('#7fcf7a');

        this.gameData = {
    gameId: null,
    condition: "sufficiency",
    gameVersion: "sufficiency_hindi_v1",

    gameStartTime: new Date().toISOString(),
    gameEndTime: null,
    totalDurationMs: null,

    userAgent: navigator.userAgent,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,

    survivalCheck: null,
    totalFoodEstimate: null,
    perCapitaEstimate: null,
    equalDivisionSurvival: null,
    groupDistributionPreference: null,
    upperClassRedistribution: null,
    socialContractGuarantee: null,
    personalVsGroupResponsibility: null,
    fairRuleChoice: null,
    foodPriorityChoice: null,
    workBreakChoice: null,
    floodPreparationChoice: null,
    personDShareChoice: null,
    personDEmpathyChoice: null,
    cooperationCompetitionChoice: null,

    screenTimings: {},

    treeClicks: {
        personA: 0,
        personB: 0,
        personC: 0
    },

    treeFruitCollected: {
        personA: 0,
        personB: 0,
        personC: 0
    },

    equalDivisionFinal: {
        personA: 0,
        personB: 0,
        personC: 0
    },

    saveStatus: null
};

        this.questionObjects = [];
        this.gameObjects = [];
        this.instructionIndex = 0;
        this.answerButtons = [];
        this.foodCounts = {};

       this.instructionScreens = [
    'सर्वाइवल गेम में आपका स्वागत है। इस खेल में, तीन लोगों का एक समूह एक ऐसे स्थान में खो जाता है जहाँ कोई और नहीं रहता।',
    'लोग जीवित रहने के लिए भोजन का शिकार और संग्रह कर रहे हैं। \n \nयदि कोई व्यक्ति प्रतिदिन कम से कम 5 भोजन के टुकड़े नहीं खाता है, तो वह मर जाएगा। \n \nयदि कोई व्यक्ति प्रतिदिन 5 से अधिक भोजन के टुकड़े इकट्ठा करता है, तो वह अगले दिन के लिए शेष भोजन बचा सकता है।',
    'यह स्थान प्राकृतिक संसाधनों से समृद्ध है और समूह के सभी लोगों के जीवित रहने के लिए हमेशा पर्याप्त भोजन उपलब्ध रहता है।',
    'व्यक्ति A प्रतिदिन सबसे अधिक भोजन के टुकड़े इकट्ठा करता है। \n \nव्यक्ति B प्रतिदिन भोजन के टुकड़ों की मध्यम मात्रा इकट्ठा करता है। \n \nव्यक्ति C प्रतिदिन सबसे कम भोजन के टुकड़े इकट्ठा करता है।',
    'आज, व्यक्ति A ने भोजन के 6 टुकड़े एकत्र किए, व्यक्ति B ने भोजन के 5 टुकड़े एकत्र किए, और व्यक्ति C ने भोजन के 4 टुकड़े एकत्र किए। \n \nकभी-कभी, कोई भी व्यक्ति आज की तुलना में अधिक या कम भोजन इकट्ठा कर सकता है।',
    'आपका कार्य समूह की ओर से ऐसे निर्णय लेना है जो समूह के अधिकतम सदस्यों के जीवित रहने को सुनिश्चित करें। \n \nखेल के अंत तक आप समूह के जितने अधिक सदस्यों को जीवित रखेंगे, खेल में आपका प्रदर्शन उतना ही बेहतर होगा।'
];

        this.showInstructionScreen();
    }

getFixedFoodCounts ()
{
    return {
        personA: 6,
        personB: 5,
        personC: 4,
        total: 15
    };
}

    showInstructionScreen ()
    {
        this.cameras.main.setBackgroundColor('#ffffff');
        this.clearQuestionScreen();

        this.addQuestionObject(this.add.rectangle(640, 360, 1000, 500, 0xffffff))
            .setStrokeStyle(4, 0x000000);

this.addQuestionObject(this.add.text(260, 145, 'निर्देश', {
            fontSize: '36px',
            color: '#000000'
        }));

        const instructionStyle = {
    fontSize: '27px',
    color: '#000000',
    wordWrap: { width: 760 },
    lineSpacing: 8
};

if (this.instructionIndex === 2)
{
    instructionStyle.fontStyle = 'bold';
}

this.addQuestionObject(
    this.add.text(
        260,
        275,
        this.instructionScreens[this.instructionIndex],
        instructionStyle
    )
);

        this.createNextButton(640, 610, 'अगला', () => {
            this.instructionIndex += 1;

            if (this.instructionIndex < this.instructionScreens.length)
            {
                this.showInstructionScreen();
            }
            else
            {
                this.showSurvivalCheckQuestion();
            }
        });
    }

    showSurvivalCheckQuestion ()
    {
        this.clearQuestionScreen();

        this.addQuestionObject(this.add.rectangle(640, 360, 900, 450, 0xffffff))
            .setStrokeStyle(4, 0x000000);

        this.addQuestionObject(this.add.text(250, 175,
            'दिन भर जीवित रहने के लिए प्रत्येक व्यक्ति को भोजन के कितने टुकड़ों की आवश्यकता है?',
            {
                fontSize: '30px',
                color: '#000000',
                align: 'center',
                wordWrap: { width: 780 }
            }
        ));

        this.createSurvivalCheckButton(640, 340, '3 pieces', false);
        this.createSurvivalCheckButton(640, 420, '5 pieces', true);
        this.createSurvivalCheckButton(640, 500, '7 pieces', false);
    }

    createSurvivalCheckButton (centerX, centerY, label, isCorrect)
    {
        const paddingX = 24;
        const paddingY = 14;

        const text = this.add.text(centerX, centerY, label, {
            fontSize: '24px',
            color: '#000000'
        }).setOrigin(0.5);

        const button = this.add.rectangle(centerX, centerY, text.width + paddingX * 2, text.height + paddingY * 2, 0xdddddd);
        button.setStrokeStyle(2, 0x000000);
        button.setInteractive({ useHandCursor: true });

        button.setDepth(1);
        text.setDepth(2);

        this.addQuestionObject(button);
        this.addQuestionObject(text);

        button.on('pointerdown', () => {
            this.gameData.survivalCheck = label;

if (isCorrect)
{
    this.showSurvivalCheckFeedback('सही।');
}
else
{
    this.showSurvivalCheckFeedback('नहीं, प्रत्येक व्यक्ति को जीवित रहने के लिए प्रतिदिन 5 भोजन के टुकड़ों की आवश्यकता होती है।');
}
        });
    }

    showSurvivalCheckFeedback (message)
    {
        this.clearQuestionScreen();

        this.addQuestionObject(this.add.rectangle(640, 360, 900, 320, 0xffffff))
            .setStrokeStyle(4, 0x000000);

        this.addQuestionObject(this.add.text(250, 290, message, {
            fontSize: '30px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 780 }
        }));

        this.createNextButton(640, 520, 'खेल प्रारंभ करें', () => {
            this.startFoodCollectionTask();
        });
    }

    startFoodCollectionTask ()
{
    this.clearQuestionScreen();
    this.clearGameObjects();

    this.foodCounts = {
        'व्यक्ति A': 0,
        'व्यक्ति B': 0,
        'व्यक्ति C': 0
    };

    // Sky
    this.addGameObject(this.add.rectangle(640, 120, 1280, 240, 0xbfefff));

    // Distant hills
    this.addGameObject(this.add.ellipse(250, 285, 650, 220, 0x6fbd6f));
    this.addGameObject(this.add.ellipse(760, 285, 750, 240, 0x5ead63));
    this.addGameObject(this.add.ellipse(1120, 285, 520, 200, 0x78c878));

    // Grass field
    this.addGameObject(this.add.rectangle(640, 470, 1280, 500, 0x4caf50));

    // Grass details
    for (let i = 0; i < 90; i++)
    {
        const grass = this.add.line(
            Phaser.Math.Between(0, 1280),
            Phaser.Math.Between(395, 690),
            0,
            0,
            Phaser.Math.Between(-6, 6),
            Phaser.Math.Between(-18, -8),
            0x2f7d32
        );

        grass.setLineWidth(2);
        this.addGameObject(grass);
    }

    this.addGameObject(this.add.text(
        40,
        60,
        'किसी व्यक्ति को चुनने के लिए उस पर क्लिक करें। फिर उस व्यक्ति के लिए भोजन इकट्ठा करने हेतु पेड़ पर क्लिक करें। जारी रखने के लिए “अगला” चुनें।',
        {
            fontSize: '26px',
            color: '#000000',
            wordWrap: { width: 900 },
            lineSpacing: 6,
            backgroundColor: '#ffffff',
            padding: { x: 12, y: 8 }
        }
    ));

    this.drawTree();

    this.avatars = [];
    this.selectedAvatar = null;

    const baselineY = 360;

    const personA = this.createHumanAvatar(
        170,
        baselineY,
        'व्यक्ति A',
        1.08,
        0xcc3333,
        0
    );

    const personB = this.createHumanAvatar(
        450,
        baselineY,
        'व्यक्ति B',
        1.00,
        0x3366cc,
        0
    );

    const personC = this.createHumanAvatar(
        730,
        baselineY,
        'व्यक्ति C',
        1.00,
        0x339966,
        0
    );

    this.avatars.push(personA, personB, personC);

    this.createGameNextButton(640, 675, 'अगला', () => {
        this.showDistributionDisplay();
    });
}

   drawTree ()
{
    this.addGameObject(this.add.rectangle(1085, 390, 50, 145, 0x8b5a2b));

    this.addGameObject(this.add.circle(1085, 245, 95, 0x1f7a2e));
    this.addGameObject(this.add.circle(1015, 300, 76, 0x2f9b3a));
    this.addGameObject(this.add.circle(1155, 300, 76, 0x2f9b3a));
    this.addGameObject(this.add.circle(1085, 350, 82, 0x238a35));
    this.addGameObject(this.add.circle(1045, 235, 60, 0x3cad48));
    this.addGameObject(this.add.circle(1128, 235, 60, 0x3cad48));

    // Lots of fruit on the tree
    const fruitPositions = [
        [-45, -75], [-15, -90], [20, -82], [52, -63],
        [-75, -30], [-35, -35], [0, -45], [38, -35], [78, -20],
        [-88, 22], [-48, 18], [-10, 5], [28, 12], [68, 28],
        [-56, 62], [-18, 55], [22, 62], [58, 70]
    ];

    fruitPositions.forEach(pos => {
        const fruit = this.add.circle(1085 + pos[0], 285 + pos[1], 7, 0xb22222);
        fruit.setStrokeStyle(1, 0x000000);
        this.addGameObject(fruit);
    });

    const treeClickZone = this.add.zone(1085, 305, 340, 380);
    treeClickZone.setInteractive({ useHandCursor: true });

    treeClickZone.on('pointerdown', () => {
        this.collectFoodFromTree();
    });

    this.addGameObject(treeClickZone);
}

    createBasket (x, y, scale)
    {
        const basket = this.add.container(x, y);

        const basketColor = 0xb87932;
        const basketDark = 0x5c3517;
        const basketLight = 0xd89a4a;

        const handle = this.add.arc(0, -11 * scale, 18 * scale, 205, 335, true);
        handle.setStrokeStyle(4 * scale, basketDark);

        const body = this.add.rectangle(0, 8 * scale, 34 * scale, 26 * scale, basketColor);
        body.setStrokeStyle(2 * scale, basketDark);

        const rim = this.add.rectangle(0, -4 * scale, 40 * scale, 8 * scale, basketLight);
        rim.setStrokeStyle(2 * scale, basketDark);

        basket.add([handle, body, rim]);

        return basket;
    }

    createHumanAvatar (x, y, label, scale, shirtColor, startingFood = 0)
    {
        const avatar = this.add.container(x, y);

        const skinColor = 0xd9a06f;
        const hairColor = 0x6b3f1d;
        const pantsColor = 0x333333;

        avatar.add([
            this.add.rectangle(0, -18 * scale, 10 * scale, 14 * scale, skinColor),
            this.add.circle(0, -43 * scale, 24 * scale, skinColor),
            this.add.ellipse(0, -64 * scale, 46 * scale, 18 * scale, hairColor),
            this.add.ellipse(-17 * scale, -55 * scale, 12 * scale, 18 * scale, hairColor),
            this.add.ellipse(17 * scale, -55 * scale, 12 * scale, 18 * scale, hairColor),
            this.add.circle(-8 * scale, -43 * scale, 2.7 * scale, 0x000000),
            this.add.circle(8 * scale, -43 * scale, 2.7 * scale, 0x000000),
            this.add.rectangle(0, -35 * scale, 3 * scale, 9 * scale, 0x9b5c2e),
            this.add.rectangle(0, -27 * scale, 12 * scale, 2 * scale, 0x000000),
            this.add.rectangle(0, 8 * scale, 46 * scale, 64 * scale, shirtColor),
            this.add.rectangle(-32 * scale, 10 * scale, 10 * scale, 52 * scale, skinColor),
            this.add.rectangle(32 * scale, 10 * scale, 10 * scale, 52 * scale, skinColor),
            this.createBasket(39 * scale, 31 * scale, scale),
            this.add.rectangle(-12 * scale, 71 * scale, 14 * scale, 48 * scale, pantsColor),
            this.add.rectangle(12 * scale, 71 * scale, 14 * scale, 48 * scale, pantsColor),
            this.add.text(0, 135 * scale, label, {
                fontSize: '22px',
                color: '#000000'
            }).setOrigin(0.5)
        ]);

        const selectPerson = () => {
            this.selectAvatar(avatar);
        };

        const clickZones = [
            this.add.zone(0, -47 * scale, 70 * scale, 65 * scale),
            this.add.zone(0, 8 * scale, 65 * scale, 78 * scale),
            this.add.zone(-32 * scale, 10 * scale, 32 * scale, 70 * scale),
            this.add.zone(32 * scale, 10 * scale, 32 * scale, 70 * scale),
            this.add.zone(39 * scale, 31 * scale, 60 * scale, 65 * scale),
            this.add.zone(-12 * scale, 75 * scale, 32 * scale, 65 * scale),
            this.add.zone(12 * scale, 75 * scale, 32 * scale, 65 * scale)
        ];

        clickZones.forEach(zone => {
            zone.setInteractive({ useHandCursor: true });
            zone.on('pointerdown', selectPerson);
            avatar.add(zone);
        });

        avatar.personLabel = label;
        avatar.foodCount = 0;

        for (let i = 0; i < startingFood; i++)
        {
            avatar.foodCount += 1;

            const position = avatar.foodCount - 1;

            const appleX = 39 + ((position % 3) - 1) * 15;
            const appleY = 25 + Math.floor(position / 3) * 13;

            avatar.add(this.add.circle(appleX, appleY, 5.5, 0xb22222));
        }

        this.addGameObject(avatar);

        return avatar;
    }

collectFoodFromTree ()
{
    if (!this.selectedAvatar) return;

    const person = this.selectedAvatar.personLabel;

    if (person === 'व्यक्ति A')
    {
        this.gameData.treeClicks.personA += 1;

        if (this.foodCounts[person] > 0) return;

        this.foodCounts[person] = 6;
        this.gameData.treeFruitCollected.personA = 6;
        this.addFoodToBasket(this.selectedAvatar, 6);

        return;
    }

    if (person === 'व्यक्ति B')
    {
        this.gameData.treeClicks.personB += 1;

        if (this.foodCounts[person] > 0) return;

        this.foodCounts[person] = 5;
        this.gameData.treeFruitCollected.personB = 5;
        this.addFoodToBasket(this.selectedAvatar, 5);

        return;
    }

    if (person === 'व्यक्ति C')
    {
        this.gameData.treeClicks.personC += 1;

        if (this.foodCounts[person] > 0) return;

        this.foodCounts[person] = 4;
        this.gameData.treeFruitCollected.personC = 4;
        this.addFoodToBasket(this.selectedAvatar, 4);
    }
}

addFoodToBasket (avatar, amount)
{
    for (let i = 0; i < amount; i++)
    {
        avatar.foodCount += 1;

        const position = avatar.foodCount - 1;

        const appleX = 39 + ((position % 3) - 1) * 15;
        const appleY = 25 + Math.floor(position / 3) * 13;

        avatar.add(this.add.circle(appleX, appleY, 5.5, 0xb22222));
    }
}

    selectAvatar (avatar)
    {
        this.selectedAvatar = avatar;

        this.avatars.forEach(person => {
            if (person.selectionBox)
            {
                person.selectionBox.destroy();
                person.selectionBox = null;
            }

            person.setDepth(10);
        });

        avatar.setDepth(100);

        avatar.selectionBox = this.add.rectangle(
            avatar.x,
            avatar.y,
            180,
            260,
            0x000000,
            0
        );

        avatar.selectionBox.setStrokeStyle(4, 0x000000);
        avatar.selectionBox.setDepth(99);

        this.addGameObject(avatar.selectionBox);
    }

    update () {}

   showDistributionDisplay ()
{
    this.clearGameObjects();
    this.clearQuestionScreen();
    this.cameras.main.setBackgroundColor('#7fcf7a');

    const fixedFood = this.getFixedFoodCounts();

    const personADisplayFood = fixedFood.personA;
    const personBDisplayFood = fixedFood.personB;
    const personCDisplayFood = fixedFood.personC;

    this.blanketFoodCount = 0;
    this.totalFoodToCount = fixedFood.total;
    this.distributionNextShown = false;

    const baselineY = 170;

    this.addQuestionObject(this.createStaticHumanAvatar(230, baselineY, 'व्यक्ति A', 1.12, 0xcc3333, 0));
    this.addQuestionObject(this.createStaticHumanAvatar(620, baselineY, 'व्यक्ति B', 1.00, 0x3366cc, 0));
    this.addQuestionObject(this.createStaticHumanAvatar(1000, baselineY, 'व्यक्ति C', 0.88, 0x339966, 0));

    this.blanket = this.add.rectangle(640, 425, 420, 115, 0xd8ecff);
    this.blanket.setStrokeStyle(4, 0x335577);
    this.blanket.setDepth(1);
    this.addQuestionObject(this.blanket);

    const blanketLabel = this.add.text(640, 425, 'कंबल', {
        fontSize: '24px',
        color: '#000000'
    }).setOrigin(0.5);

    blanketLabel.setDepth(2);
    this.addQuestionObject(blanketLabel);

    this.blanketCounterText = this.add.text(640, 515, 'गिने गए टुकड़े: 0', {
        fontSize: '26px',
        color: '#000000'
    }).setOrigin(0.5);

    this.blanketCounterText.setDepth(2);
    this.addQuestionObject(this.blanketCounterText);

    this.createDraggableFoodPieces(230, baselineY, 1.12, personADisplayFood);
    this.createDraggableFoodPieces(620, baselineY, 1.00, personBDisplayFood);
    this.createDraggableFoodPieces(1000, baselineY, 0.88, personCDisplayFood);

    this.addQuestionObject(this.add.text(150, 550,
        'समूह ने कितने भोजन के टुकड़े इकट्ठा किए हैं, यह गिनने के लिए प्रत्येक भोजन के टुकड़े को खींचकर कंबल पर ढेर में रखें।',
        {
            fontSize: '24px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 980 }
        }
    ));
}

createDraggableFoodPieces (avatarX, avatarY, scale, foodAmount)
{
    const getBlanketFoodPosition = (index) => {

        const positions = [
            [-150, -25], [-115, -25], [-80, -25],
            [-150, 10],  [-115, 10],  [-80, 10],

            [80, -25], [115, -25], [150, -25],
            [80, 10],  [115, 10],  [150, 10],

            [-150, 45], [-115, 45], [-80, 45],
            [80, 45], [115, 45], [150, 45]
        ];

        return positions[index];
    };

    for (let i = 0; i < foodAmount; i++)
    {
        const position = i;

        const startX =
            avatarX +
            (39 + ((position % 3) - 1) * 15)
            * scale;

        const startY =
            avatarY +
            (25 + Math.floor(position / 3) * 13)
            * scale;

        const food =
            this.add.circle(
                startX,
                startY,
                7,
                0xb22222
            );

        food.setStrokeStyle(1, 0x000000);
        food.setInteractive({ useHandCursor: true });
        food.setDepth(10);

        food.startX = startX;
        food.startY = startY;
        food.counted = false;

        this.input.setDraggable(food);

        food.on('dragstart', () => {
            food.setDepth(20);
        });

        food.on('drag', (pointer, dragX, dragY) => {

            food.x = dragX;
            food.y = dragY;

        });

        food.on('dragend', () => {

            const blanketBounds =
                this.blanket.getBounds();

            if (
                Phaser.Geom.Rectangle.Contains(
                    blanketBounds,
                    food.x,
                    food.y
                )
            )
            {
                if (!food.counted)
                {
                    food.counted = true;

                    this.blanketFoodCount += 1;

                    const pilePosition =
                        this.blanketFoodCount - 1;

                    const blanketPosition =
                        getBlanketFoodPosition(
                            pilePosition
                        );

                    food.x =
                        this.blanket.x +
                        blanketPosition[0];

                    food.y =
                        this.blanket.y +
                        blanketPosition[1];

                    this.blanketCounterText
                        .setText(
                            `गिने गए टुकड़े: ${this.blanketFoodCount}`
                        );

                    if (
                        this.blanketFoodCount === this.totalFoodToCount &&
                        !this.distributionNextShown
                    )
                    {
                        this.distributionNextShown = true;

                        this.time.delayedCall(100, () => {

                            this.createNextButton(
                                640,
                                675,
                                'अगला',
                                () => {
                                    this.showTotalFoodEstimateQuestion();
                                }
                            );

                        });
                    }
                }

                food.setDepth(20);
            }
            else
            {
                if (!food.counted)
                {
                    food.x = food.startX;
                    food.y = food.startY;
                }

                food.setDepth(10);
            }

        });

        this.addQuestionObject(food);
    }
}

showTotalFoodEstimateQuestion ()
{
    this.clearQuestionScreen();

    this.addQuestionObject(
        this.add.rectangle(
            640,
            360,
            1120,
            520,
            0xffffff
        )
        .setStrokeStyle(
            4,
            0x000000
        )
    );

    this.addQuestionObject(
        this.add.text(
            640,
            220,
            'आपके अनुमान में समूह ने आज कुल कितनी भोजन इकाइयाँ इकट्ठा कीं?',
            {
                fontSize: '30px',
                color: '#000000',
                align: 'center',
                wordWrap:
                {
                    width: 900
                },
                lineSpacing: 8
            }
        )
        .setOrigin(0.5)
    );

    let answers =
[
    '15 से अधिक भोजन के टुकड़े',
    'ठीक 15 भोजन के टुकड़े',
    '15 से कम भोजन के टुकड़े'
];

    if (Phaser.Math.Between(0, 1) === 1)
    {
        answers =
            answers.reverse();
    }

    this.createAnswerButton(
        640,
        360,
        answers[0],
        'totalFoodEstimate'
    );

    this.createAnswerButton(
        640,
        460,
        answers[1],
        'totalFoodEstimate'
    );

    this.createAnswerButton(
        640,
        560,
        answers[2],
        'totalFoodEstimate'
    );
}

 showEqualDivisionTask ()
{
    this.clearQuestionScreen();

    const fixedFood = this.getFixedFoodCounts();

    const totalFood = fixedFood.total;

    this.equalDivisionCounts = {
        'व्यक्ति A': 0,
        'व्यक्ति B': 0,
        'व्यक्ति C': 0
    };

    this.equalDivisionAssignedCount = 0;
    this.equalDivisionNextShown = false;

    this.addQuestionObject(this.add.text(
        145,
        35,
        'कल्पना करें कि यदि समूह भोजन को बराबर बाँट दे तो क्या होगा। भोजन के टुकड़ों को कंबल से प्रत्येक व्यक्ति तक खींचकर ले जाएँ।',
        {
            fontSize: '25px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 990 }
        }
    ));

    this.equalDivisionBlanket = this.add.rectangle(
        640,
        195,
        500,
        130,
        0xd8ecff
    );

    this.equalDivisionBlanket.setStrokeStyle(4, 0x335577);
    this.equalDivisionBlanket.setDepth(1);

    this.addQuestionObject(this.equalDivisionBlanket);

    const blanketLabel = this.add.text(
        640,
        195,
        'कंबल',
        {
            fontSize: '24px',
            color: '#000000'
        }
    ).setOrigin(0.5);

    blanketLabel.setDepth(2);

    this.addQuestionObject(blanketLabel);

    const baselineY = 430;

    this.equalDivisionBaselineY = baselineY;

    this.addQuestionObject(
        this.createStaticHumanAvatar(
            260,
            baselineY,
            'व्यक्ति A',
            1.05,
            0xcc3333,
            0
        )
    );

    this.addQuestionObject(
        this.createStaticHumanAvatar(
            640,
            baselineY,
            'व्यक्ति B',
            1.00,
            0x3366cc,
            0
        )
    );

    this.addQuestionObject(
        this.createStaticHumanAvatar(
            1020,
            baselineY,
            'व्यक्ति C',
            0.90,
            0x339966,
            0
        )
    );

    this.personDropZones = {
        'व्यक्ति A':
            this.add.zone(260, baselineY + 25, 210, 270)
                .setRectangleDropZone(210, 270),

        'व्यक्ति B':
            this.add.zone(640, baselineY + 25, 210, 270)
                .setRectangleDropZone(210, 270),

        'व्यक्ति C':
            this.add.zone(1020, baselineY + 25, 210, 270)
                .setRectangleDropZone(210, 270)
    };

    Object.values(this.personDropZones).forEach(zone => {
        this.addQuestionObject(zone);
    });

    this.createEqualDivisionFoodPieces(totalFood);
}

createEqualDivisionFoodPieces (totalFood)
{
    const getBlanketFoodPosition = (index) => {

        const positions = [
            [-170, -25], [-130, -25], [-90, -25],
            [-170, 10], [-130, 10], [-90, 10],

            [90, -25], [130, -25], [170, -25],
            [90, 10], [130, 10], [170, 10],

            [-170, 45], [-130, 45], [-90, 45],
            [90, 45], [130, 45], [170, 45]
        ];

        return positions[index];
    };

    const showEqualDivisionNextButtonIfReady = () => {
        if (
            this.equalDivisionAssignedCount === totalFood &&
            !this.equalDivisionNextShown
        )
        {
            this.equalDivisionNextShown = true;

            this.createNextButton(640, 675, 'अगला', () => {

                this.gameData.equalDivisionFinal.personA =
                    this.equalDivisionCounts['व्यक्ति A'];

                this.gameData.equalDivisionFinal.personB =
                    this.equalDivisionCounts['व्यक्ति B'];

                this.gameData.equalDivisionFinal.personC =
                    this.equalDivisionCounts['व्यक्ति C'];

                this.showPerCapitaQuestion();
            });
        }
    };

    for (let i = 0; i < totalFood; i++)
    {
        const blanketPosition = getBlanketFoodPosition(i);

        const startX =
            this.equalDivisionBlanket.x + blanketPosition[0];

        const startY =
            this.equalDivisionBlanket.y + blanketPosition[1];

        const food = this.add.circle(
            startX,
            startY,
            7,
            0xb22222
        );

        food.setStrokeStyle(1, 0x000000);

        food.setInteractive({
            useHandCursor: true
        });

        food.setDepth(10);

        food.startX = startX;
        food.startY = startY;
        food.assignedPerson = null;

        this.input.setDraggable(food);

        food.on('dragstart', () => {
            food.setDepth(20);
        });

        food.on('drag', (pointer, dragX, dragY) => {
            food.x = dragX;
            food.y = dragY;
        });

        food.on('dragend', () => {

            let droppedOnPerson = null;

            Object.keys(this.personDropZones).forEach(personLabel => {

                const bounds =
                    this.personDropZones[personLabel].getBounds();

                if (
                    Phaser.Geom.Rectangle.Contains(
                        bounds,
                        food.x,
                        food.y
                    )
                )
                {
                    droppedOnPerson = personLabel;
                }
            });

            if (droppedOnPerson)
            {
                if (food.assignedPerson)
                {
                    this.equalDivisionCounts[food.assignedPerson] -= 1;
                }
                else
                {
                    this.equalDivisionAssignedCount += 1;
                }

                food.assignedPerson = droppedOnPerson;

                this.equalDivisionCounts[droppedOnPerson] += 1;

                const pilePosition =
                    this.equalDivisionCounts[droppedOnPerson] - 1;

                const basketPositions = {
                    'व्यक्ति A': {
                        x: 260 + 39 * 1.05,
                        y: this.equalDivisionBaselineY + 31 * 1.05,
                        scale: 1.05
                    },

                    'व्यक्ति B': {
                        x: 640 + 39,
                        y: this.equalDivisionBaselineY + 31,
                        scale: 1
                    },

                    'व्यक्ति C': {
                        x: 1020 + 39 * .90,
                        y: this.equalDivisionBaselineY + 31 * .90,
                        scale: .90
                    }
                };

                const basket = basketPositions[droppedOnPerson];

                food.x =
                    basket.x +
                    ((pilePosition % 3) - 1) * 15 * basket.scale;

                food.y =
                    basket.y -
                    6 * basket.scale +
                    Math.floor(pilePosition / 3) * 13 * basket.scale;

                food.setDepth(20);

                showEqualDivisionNextButtonIfReady();
            }
            else
            {
                if (food.assignedPerson)
                {
                    this.equalDivisionCounts[food.assignedPerson] -= 1;

                    this.equalDivisionAssignedCount -= 1;

                    food.assignedPerson = null;
                }

                food.x = food.startX;
                food.y = food.startY;

                food.setDepth(10);
            }
        });

        this.addQuestionObject(food);
    }
}
    showPerCapitaQuestion ()
    {
        this.clearQuestionScreen();

        this.addQuestionObject(this.add.rectangle(640, 360, 900, 450, 0xffffff))
            .setStrokeStyle(4, 0x000000);

        this.addQuestionObject(this.add.text(230, 170,
            'यदि समूह के तीन सदस्य आज इकट्ठा किए गए भोजन के कुल टुकड़ों को बराबर बाँट लें, तो प्रत्येक व्यक्ति को कितने टुकड़े मिलेंगे?',
            {
                fontSize: '28px',
                color: '#000000',
                align: 'center',
                wordWrap: { width: 820 }
            }
        ));

    this.createAnswerButton(640, 365, 'प्रत्येक को 5 से अधिक भोजन के टुकड़े', 'perCapitaEstimate');
    this.createAnswerButton(640, 445, 'प्रत्येक को ठीक 5 भोजन के टुकड़े', 'perCapitaEstimate');
    this.createAnswerButton(640, 525, 'प्रत्येक को 5 से कम भोजन के टुकड़े', 'perCapitaEstimate');
    }

    createStaticHumanAvatar (x, y, label, scale, shirtColor, foodAmount = 0, showBasket = true)
    {
        const person = this.add.container(x, y);

        const skinColor = 0xd9a06f;
        const hairColor = 0x6b3f1d;
        const pantsColor = 0x333333;

        person.foodCount = 0;

        person.add(this.add.rectangle(0, -18 * scale, 10 * scale, 14 * scale, skinColor));
        person.add(this.add.circle(0, -43 * scale, 24 * scale, skinColor));

        person.add(this.add.ellipse(0, -64 * scale, 46 * scale, 18 * scale, hairColor));
        person.add(this.add.ellipse(-17 * scale, -55 * scale, 12 * scale, 18 * scale, hairColor));
        person.add(this.add.ellipse(17 * scale, -55 * scale, 12 * scale, 18 * scale, hairColor));

        person.add(this.add.circle(-8 * scale, -43 * scale, 2.7 * scale, 0x000000));
        person.add(this.add.circle(8 * scale, -43 * scale, 2.7 * scale, 0x000000));

        person.add(this.add.rectangle(0, -35 * scale, 3 * scale, 9 * scale, 0x9b5c2e));
        person.add(this.add.rectangle(0, -27 * scale, 12 * scale, 2 * scale, 0x000000));

        person.add(this.add.rectangle(0, 8 * scale, 46 * scale, 64 * scale, shirtColor));

        person.add(this.add.rectangle(-32 * scale, 10 * scale, 10 * scale, 52 * scale, skinColor));
        person.add(this.add.rectangle(32 * scale, 10 * scale, 10 * scale, 52 * scale, skinColor));

        if (showBasket)
        {
            person.add(this.createBasket(39 * scale, 31 * scale, scale));

            for (let i = 0; i < foodAmount; i++)
            {
                person.foodCount += 1;

                const position = person.foodCount - 1;

                const appleX = (39 + ((position % 3) - 1) * 15) * scale;
                const appleY = (25 + Math.floor(position / 3) * 13) * scale;

                person.add(this.add.circle(appleX, appleY, 5.5 * scale, 0xb22222));
            }
        }

        person.add(this.add.rectangle(-12 * scale, 71 * scale, 14 * scale, 48 * scale, pantsColor));
        person.add(this.add.rectangle(12 * scale, 71 * scale, 14 * scale, 48 * scale, pantsColor));

        person.add(this.add.text(0, 135 * scale, label, {
            fontSize: '26px',
            color: '#000000'
        }).setOrigin(0.5));

        return person;
    }

    showEqualDivisionSurvivalQuestion ()
{
    this.clearQuestionScreen();

    this.addQuestionObject(this.add.rectangle(640, 360, 1080, 430, 0xffffff))
        .setStrokeStyle(4, 0x000000);

    this.addQuestionObject(this.add.text(
        640,
        230,
        'यदि तीनों लोग आज इकट्ठा किए गए भोजन के कुल टुकड़ों को बराबर बाँट लें, तो क्या उन सभी के पास दिन भर जीवित रहने के लिए पर्याप्त भोजन होगा?',
        {
            fontSize: '27px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 940 },
            lineSpacing: 6
        }
    ).setOrigin(0.5));

    const answers = Phaser.Utils.Array.Shuffle([
    'हाँ, यदि भोजन के टुकड़े बराबर बाँटे जाएँ, तो प्रत्येक व्यक्ति के पास दिन भर जीवित रहने के लिए पर्याप्त भोजन होगा।',
    'नहीं, यदि भोजन के टुकड़े बराबर बाँटे जाएँ, तो प्रत्येक व्यक्ति के पास दिन भर जीवित रहने के लिए पर्याप्त भोजन नहीं होगा।'
    ]);

    this.createAnswerButton(640, 410, answers[0], 'equalDivisionSurvival');
    this.createAnswerButton(640, 520, answers[1], 'equalDivisionSurvival');
}

showSurvivalGoalReminderScreen ()
{
    this.clearQuestionScreen();

    this.addQuestionObject(this.add.rectangle(640, 360, 1080, 430, 0xffffff))
        .setStrokeStyle(4, 0x000000);

    this.addQuestionObject(this.add.text(
        640,
        315,
        'याद रखें, आपका कार्य समूह की ओर से ऐसे निर्णय लेना है जो समूह के अधिकतम सदस्यों के जीवित रहने को सुनिश्चित करें।',
        {
            fontSize: '30px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 900 },
            lineSpacing: 8
        }
    ).setOrigin(0.5));

    this.createNextButton(640, 675, 'अगला', () => {
        this.showGroupDistributionPreferenceQuestion();
    });
}


showGroupDistributionPreferenceQuestion ()
{
    this.clearQuestionScreen();

    const fixedFood = this.getFixedFoodCounts();

const personADisplayFood = fixedFood.personA;
const personBDisplayFood = fixedFood.personB;
const personCDisplayFood = fixedFood.personC;

    this.addQuestionObject(this.createStaticHumanAvatar(260, 115, 'व्यक्ति A', 0.78, 0xcc3333, personADisplayFood));
    this.addQuestionObject(this.createStaticHumanAvatar(640, 115, 'व्यक्ति B', 0.72, 0x3366cc, personBDisplayFood));
    this.addQuestionObject(this.createStaticHumanAvatar(980, 115, 'व्यक्ति C', 0.66, 0x339966, personCDisplayFood));

    this.addQuestionObject(this.add.rectangle(640, 460, 1080, 340, 0xffffff))
        .setStrokeStyle(4, 0x000000);

    this.addQuestionObject(this.add.text(
        640,
        345,
        'समूह को भोजन को समूह के सदस्यों के बीच कैसे बाँटना चाहिए?',
        {
            fontSize: '29px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 940 }
        }
    ).setOrigin(0.5));

    const answers = Phaser.Utils.Array.Shuffle([
    'समूह को भोजन को समूह के सदस्यों के बीच समान रूप से बाँटना चाहिए।',
    'समूह के प्रत्येक सदस्य को वही भोजन अपने पास रखना चाहिए जो उसने स्वयं इकट्ठा किया है।'
    ]);

    this.createAnswerButton(640, 465, answers[0], 'groupDistributionPreference');
    this.createAnswerButton(640, 560, answers[1], 'groupDistributionPreference');
}

showUpperClassRedistributionQuestion ()
{
    this.clearQuestionScreen();

    const fixedFood = this.getFixedFoodCounts();

const personADisplayFood = fixedFood.personA;
const personBDisplayFood = fixedFood.personB;
const personCDisplayFood = fixedFood.personC;

    this.addQuestionObject(this.createStaticHumanAvatar(260, 125, 'व्यक्ति A', 0.78, 0xcc3333, personADisplayFood));
    this.addQuestionObject(this.createStaticHumanAvatar(640, 125, 'व्यक्ति B', 0.72, 0x3366cc, personBDisplayFood));
    this.addQuestionObject(this.createStaticHumanAvatar(980, 125, 'व्यक्ति C', 0.66, 0x339966, personCDisplayFood));

    this.addQuestionObject(this.add.rectangle(640, 450, 1050, 350, 0xffffff))
        .setStrokeStyle(4, 0x000000);

    this.addQuestionObject(this.add.text(210, 325,
        'क्या व्यक्ति A को अपना भोजन व्यक्ति C के साथ साझा करना चाहिए, या उसे अपना भोजन किसी दूसरे दिन स्वयं खाने के लिए बचाकर रखना चाहिए?',
        {
            fontSize: '28px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 860 }
        }
    ));

this.createAnswerButton(640, 460, 'व्यक्ति A को अपना भोजन व्यक्ति C के साथ साझा करना चाहिए।', 'upperClassRedistribution');
this.createAnswerButton(640, 545, 'व्यक्ति A को अपना भोजन स्वयं खाने के लिए बचाकर रखना चाहिए।', 'upperClassRedistribution');
}

showSocialContractQuestion ()
{
    this.clearQuestionScreen();

    this.addQuestionObject(this.add.rectangle(640, 360, 1120, 500, 0xffffff))
        .setStrokeStyle(4, 0x000000);

    this.addQuestionObject(this.add.text(
        640,
        235,
        'क्या समूह एक ऐसा सामाजिक अनुबंध बना सकता है जो यह सुनिश्चित करे कि प्रत्येक सदस्य के पास हमेशा जीवित रहने के लिए न्यूनतम भोजन उपलब्ध होगा?',
        {
            fontSize: '27px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 980 },
            lineSpacing: 6
        }
    ).setOrigin(0.5));

    const answers = Phaser.Utils.Array.Shuffle([
     'हाँ, समूह ऐसा सामाजिक अनुबंध बना सकता है जो यह सुनिश्चित करे कि प्रत्येक सदस्य के पास हमेशा जीवित रहने के लिए न्यूनतम भोजन उपलब्ध होगा।',
    'नहीं, समूह ऐसा सामाजिक अनुबंध नहीं बना सकता जो यह सुनिश्चित करे कि प्रत्येक सदस्य के पास हमेशा जीवित रहने के लिए न्यूनतम भोजन उपलब्ध होगा।'
    ]);

    this.createAnswerButton(640, 410, answers[0], 'socialContractGuarantee');
    this.createAnswerButton(640, 535, answers[1], 'socialContractGuarantee');
}

showPersonalVsGroupResponsibilityQuestion ()
{
    this.clearQuestionScreen();

    this.addQuestionObject(this.add.rectangle(640, 360, 1120, 500, 0xffffff))
        .setStrokeStyle(4, 0x000000);

    this.addQuestionObject(this.add.text(
        640,
        230,
        'आज और भविष्य में अधिकतम लोगों के जीवित रहने के लिए क्या यह अधिक महत्वपूर्ण है कि समूह का प्रत्येक सदस्य स्वयं के जीवित रहने के लिए पर्याप्त भोजन इकट्ठा करने की व्यक्तिगत जिम्मेदारी ले, या यह सुनिश्चित करने की जिम्मेदारी ले कि समूह के सभी सदस्यों के पास जीवित रहने के लिए पर्याप्त भोजन हो?',
        {
            fontSize: '25px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 980 },
            lineSpacing: 6
        }
    ).setOrigin(0.5));

    const answers = Phaser.Utils.Array.Shuffle([
           'यह अधिक महत्वपूर्ण है कि समूह का प्रत्येक सदस्य यह सुनिश्चित करने की जिम्मेदारी ले कि समूह के सभी सदस्यों के पास जीवित रहने के लिए पर्याप्त भोजन हो।',
    'यह अधिक महत्वपूर्ण है कि समूह का प्रत्येक सदस्य स्वयं के जीवित रहने के लिए पर्याप्त भोजन इकट्ठा करने की व्यक्तिगत जिम्मेदारी ले।'
    ]);

    this.createAnswerButton(640, 430, answers[0], 'personalVsGroupResponsibility');
    this.createAnswerButton(640, 550, answers[1], 'personalVsGroupResponsibility');
}

showFairRuleQuestion ()
{
    this.clearQuestionScreen();

    this.addQuestionObject(this.add.rectangle(640, 360, 1120, 500, 0xffffff))
        .setStrokeStyle(4, 0x000000);

    this.addQuestionObject(this.add.text(
        640,
        230,
        'इस समूह के लोगों के लिए कौन-सा नियम अधिक न्यायसंगत है?',
        {
            fontSize: '29px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 980 },
            lineSpacing: 6
        }
    ).setOrigin(0.5));

    const answers = Phaser.Utils.Array.Shuffle([
     'एक न्यायसंगत नियम यह होगा कि जब भी तीनों लोग एक दिन में 5 से अधिक भोजन के टुकड़े इकट्ठा करें, वे हमेशा अपना भोजन समान रूप से साझा करें।',
    'एक न्यायसंगत नियम यह होगा कि प्रत्येक व्यक्ति द्वारा खाया जाने वाला भोजन उस मात्रा के अनुपात में हो जो उसने स्वयं इकट्ठा की है।'
    ]);

    this.createAnswerButton(640, 410, answers[0], 'fairRuleChoice');
    this.createAnswerButton(640, 540, answers[1], 'fairRuleChoice');
}

showFoodRankReminderScreen ()
{
    this.clearQuestionScreen();

    this.gameData.foodRankReminder = 'shown';

    this.addQuestionObject(this.add.rectangle(640, 360, 1080, 520, 0xffffff))
        .setStrokeStyle(4, 0x000000);

    const fixedFood = this.getFixedFoodCounts();

this.addQuestionObject(this.createStaticHumanAvatar(280, 185, 'व्यक्ति A', 1.12, 0xcc3333, fixedFood.personA));
this.addQuestionObject(this.createStaticHumanAvatar(640, 185, 'व्यक्ति B', 1.00, 0x3366cc, fixedFood.personB));
this.addQuestionObject(this.createStaticHumanAvatar(1000, 185, 'व्यक्ति C', 0.88, 0x339966, fixedFood.personC));

    this.addQuestionObject(this.add.text(
        640,
        450,
        'याद रखें, व्यक्ति A प्रतिदिन सबसे अधिक भोजन के टुकड़े इकट्ठा करता है। व्यक्ति B प्रतिदिन औसत मात्रा में भोजन के टुकड़े इकट्ठा करता है। व्यक्ति C प्रतिदिन सबसे कम भोजन के टुकड़े इकट्ठा करता है।',
        {
            fontSize: '27px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 940 },
            lineSpacing: 8
        }
    ).setOrigin(0.5));

    this.createNextButton(640, 675, 'अगला', () => {
        this.showFoodPriorityQuestion();
    });
}

showFoodPriorityQuestion ()
{
    this.clearQuestionScreen();

    this.addQuestionObject(this.createStaticHumanAvatar(280, 90, 'व्यक्ति A', 0.82, 0xcc3333, 0));
    this.addQuestionObject(this.createStaticHumanAvatar(640, 90, 'व्यक्ति B', 0.74, 0x3366cc, 0));
    this.addQuestionObject(this.createStaticHumanAvatar(1000, 90, 'व्यक्ति C', 0.66, 0x339966, 0));

    this.addQuestionObject(this.add.rectangle(640, 435, 1120, 390, 0xffffff))
        .setStrokeStyle(4, 0x000000);

    this.addQuestionObject(this.add.text(
        640,
        285,
        'अधिकतम लोगों को जीवित रखने के लिए समूह को किस व्यक्ति की भोजन आवश्यकताओं को प्राथमिकता देनी चाहिए?',
        {
            fontSize: '27px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 980 },
            lineSpacing: 6
        }
    ).setOrigin(0.5));

    const answers = Phaser.Utils.Array.Shuffle([
     'समूह को यह सुनिश्चित करना चाहिए कि व्यक्ति C को प्रतिदिन इकट्ठा किए गए भोजन में से कम से कम 5 टुकड़े मिलें, क्योंकि अन्य लोगों के पास पहले से ही अपने लिए पर्याप्त भोजन है और पर्याप्त भोजन न मिलने पर व्यक्ति C मर जाएगा।',
    'समूह को यह सुनिश्चित करना चाहिए कि व्यक्ति A को प्रतिदिन इकट्ठा किए गए भोजन में से कम से कम 5 टुकड़े मिलें, क्योंकि व्यक्ति A सामान्यतः सबसे अधिक भोजन साझा करने में सक्षम होता है और लंबे समय तक जीवित रहने की सबसे अधिक संभावना उसी की है।'
    ]);

    this.createAnswerButton(640, 400, answers[0], 'foodPriorityChoice');
    this.createAnswerButton(640, 535, answers[1], 'foodPriorityChoice');
}

showHardWorkReminderScreen ()
{
    this.clearQuestionScreen();

    this.addQuestionObject(this.add.rectangle(640, 360, 1080, 520, 0xffffff))
        .setStrokeStyle(4, 0x000000);

    this.addQuestionObject(this.createTiredHumanAvatar(280, 240, 'व्यक्ति A', 1.12, 0xcc3333));
    this.addQuestionObject(this.createTiredHumanAvatar(640, 240, 'व्यक्ति B', 1.00, 0x3366cc));
    this.addQuestionObject(this.createTiredHumanAvatar(1000, 240, 'व्यक्ति C', 0.88, 0x339966));

    this.addQuestionObject(this.add.text(
        640,
        480,
        'भोजन का शिकार और संग्रह करना कठिन काम है।',
        {
            fontSize: '30px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 940 },
            lineSpacing: 8
        }
    ).setOrigin(0.5));

    this.createNextButton(640, 675, 'अगला', () => {
        this.showWorkBreakQuestion();
    });
}

showWorkBreakQuestion ()
{
    this.clearQuestionScreen();

    this.addQuestionObject(this.createTiredFace(640, 145, 1.6));

    this.addQuestionObject(this.add.rectangle(640, 465, 1120, 360, 0xffffff))
        .setStrokeStyle(4, 0x000000);

    this.addQuestionObject(this.add.text(
        640,
        340,
        'एक दिन, लोगों में से एक व्यक्ति बहुत थक जाता है और भोजन का शिकार एवं संग्रह करने से विराम लेना चाहता है। क्या उस व्यक्ति को काम जारी रखना चाहिए या विराम लेना चाहिए?',
        {
            fontSize: '27px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 980 },
            lineSpacing: 6
        }
    ).setOrigin(0.5));

    const answers = Phaser.Utils.Array.Shuffle([
    'व्यक्ति को विराम लेना चाहिए।',
    'व्यक्ति को भोजन का शिकार और संग्रह करना जारी रखना चाहिए।'
    ]);

    this.createAnswerButton(640, 475, answers[0], 'workBreakChoice');
    this.createAnswerButton(640, 570, answers[1], 'workBreakChoice');
}

createTiredHumanAvatar (x, y, label, scale, shirtColor)
{
    const person = this.add.container(x, y);

    const skinColor = 0xd9a06f;
    const hairColor = 0x6b3f1d;
    const pantsColor = 0x333333;
    const sweatColor = 0x4aa3df;

    person.add(this.add.rectangle(0, -18 * scale, 10 * scale, 14 * scale, skinColor));
    person.add(this.add.circle(0, -43 * scale, 24 * scale, skinColor));

    person.add(this.add.ellipse(0, -64 * scale, 46 * scale, 18 * scale, hairColor));
    person.add(this.add.ellipse(-17 * scale, -55 * scale, 12 * scale, 18 * scale, hairColor));
    person.add(this.add.ellipse(17 * scale, -55 * scale, 12 * scale, 18 * scale, hairColor));

    person.add(this.add.rectangle(-8 * scale, -43 * scale, 12 * scale, 2 * scale, 0x000000));
    person.add(this.add.rectangle(8 * scale, -43 * scale, 12 * scale, 2 * scale, 0x000000));

    person.add(this.add.rectangle(0, -35 * scale, 3 * scale, 9 * scale, 0x9b5c2e));
    person.add(this.add.arc(0, -24 * scale, 9 * scale, 200, 340, false, 0x000000));

    // Sweat on forehead
    person.add(this.add.circle(-9 * scale, -50 * scale, 3.2 * scale, sweatColor));
    person.add(this.add.circle(7 * scale, -59 * scale, 3 * scale, sweatColor));

    // Sweat on left side of face
    person.add(this.add.circle(-22 * scale, -38 * scale, 3.5 * scale, sweatColor));

    // Sweat on right side of face
    person.add(this.add.circle(18 * scale, -45 * scale, 2.8 * scale, sweatColor));

    person.add(this.add.rectangle(0, 8 * scale, 46 * scale, 64 * scale, shirtColor));

    person.add(this.add.rectangle(-34 * scale, 15 * scale, 10 * scale, 52 * scale, skinColor).setAngle(18));
    person.add(this.add.rectangle(34 * scale, 15 * scale, 10 * scale, 52 * scale, skinColor).setAngle(-18));

    person.add(this.add.rectangle(-12 * scale, 71 * scale, 14 * scale, 48 * scale, pantsColor));
    person.add(this.add.rectangle(12 * scale, 71 * scale, 14 * scale, 48 * scale, pantsColor));

    person.add(this.add.text(0, 135 * scale, label, {
        fontSize: '26px',
        color: '#000000'
    }).setOrigin(0.5));

    return person;
}

createTiredFace (x, y, scale)
{
    const face = this.add.container(x, y);

    const skinColor = 0xd9a06f;
    const hairColor = 0x6b3f1d;
    const sweatColor = 0x4aa3df;

    face.add(this.add.circle(0, 0, 48 * scale, skinColor));

    face.add(this.add.ellipse(0, -45 * scale, 90 * scale, 30 * scale, hairColor));
    face.add(this.add.ellipse(-34 * scale, -28 * scale, 22 * scale, 38 * scale, hairColor));
    face.add(this.add.ellipse(34 * scale, -28 * scale, 22 * scale, 38 * scale, hairColor));

    face.add(this.add.rectangle(-18 * scale, -5 * scale, 20 * scale, 3 * scale, 0x000000));
    face.add(this.add.rectangle(18 * scale, -5 * scale, 20 * scale, 3 * scale, 0x000000));

    face.add(this.add.rectangle(0, 10 * scale, 5 * scale, 16 * scale, 0x9b5c2e));
    face.add(this.add.arc(0, 35 * scale, 18 * scale, 200, 340, false, 0x000000));

    // Sweat on forehead
    face.add(this.add.circle(-15 * scale, -30 * scale, 6 * scale, sweatColor));

    // Sweat on left side of face
    face.add(this.add.circle(-40 * scale, -6 * scale, 6 * scale, sweatColor));
    face.add(this.add.circle(-46 * scale, 10 * scale, 4.5 * scale, sweatColor));

    // Sweat on right side of face
    face.add(this.add.circle(40 * scale, -9 * scale, 6 * scale, sweatColor));
    face.add(this.add.circle(46 * scale, 20 * scale, 4.5 * scale, sweatColor));

    return face;
}

showFloodRiskInstructionScreen ()
{
    this.clearQuestionScreen();

    const sticksOnLeft = Phaser.Math.Between(0, 1) === 0;

    this.floodTaskSides = {
        sticksX: sticksOnLeft ? 230 : 1050,
        treeX: sticksOnLeft ? 1050 : 230
    };

    this.addQuestionObject(this.add.rectangle(640, 360, 1120, 560, 0xffffff))
        .setStrokeStyle(4, 0x000000);

    // Small storm cloud off to the top right
    this.drawStormCloud(1035, 120, 0.55);

    // People in the middle, no labels, no baskets
    this.addQuestionObject(this.createStaticHumanAvatar(470, 345, '', 0.95, 0xcc3333, 0, false));
    this.addQuestionObject(this.createStaticHumanAvatar(640, 345, '', 0.88, 0x3366cc, 0, false));
    this.addQuestionObject(this.createStaticHumanAvatar(810, 345, '', 0.80, 0x339966, 0, false));

    this.addQuestionObject(this.add.text(
        640,
        575,
        'यह बहुत संभव है कि कुछ ही हफ्तों में वर्षा ऋतु आने पर यह स्थान बाढ़ग्रस्त हो जाएगा।',
        {
            fontSize: '27px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 980 },
            lineSpacing: 6
        }
    ).setOrigin(0.5));

    this.createNextButton(640, 675, 'अगला', () => {
        this.showFloodPreparationQuestion();
    });
}

drawStormCloud (x, y, scale = 1)
{
    const cloudColor = 0x6f7780;
    const darkCloudColor = 0x505860;
    const rainColor = 0x3f7fbf;

    this.addQuestionObject(this.add.circle(x - 55 * scale, y + 5 * scale, 34 * scale, cloudColor));
    this.addQuestionObject(this.add.circle(x - 20 * scale, y - 15 * scale, 45 * scale, cloudColor));
    this.addQuestionObject(this.add.circle(x + 30 * scale, y - 10 * scale, 40 * scale, darkCloudColor));
    this.addQuestionObject(this.add.circle(x + 70 * scale, y + 8 * scale, 30 * scale, cloudColor));
    this.addQuestionObject(this.add.rectangle(x + 8 * scale, y + 18 * scale, 150 * scale, 42 * scale, cloudColor));

    for (let i = 0; i < 6; i++)
    {
        const rain = this.add.line(
            x - 65 * scale + i * 26 * scale,
            y + 65 * scale,
            0,
            0,
            -8 * scale,
            28 * scale,
            rainColor
        );

        rain.setLineWidth(3 * scale);
        this.addQuestionObject(rain);
    }
}

drawStickPile (x, y)
{
    const stickColor = 0x8b5a2b;

    for (let i = 0; i < 8; i++)
    {
        const stick = this.add.rectangle(
            x + Phaser.Math.Between(-35, 35),
            y + Phaser.Math.Between(-20, 20),
            95,
            9,
            stickColor
        );

        stick.setAngle(Phaser.Math.Between(-35, 35));
        stick.setStrokeStyle(1, 0x4a2a12);
        this.addQuestionObject(stick);
    }
}

drawFloodTaskTree (x, y)
{
    // Trunk
    this.addQuestionObject(
        this.add.rectangle(
            x,
            y + 75,
            36,
            130,
            0x9b6329
        )
    );

    // Leaves
    this.addQuestionObject(this.add.circle(x, y - 40, 78, 0x2f7d32));
    this.addQuestionObject(this.add.circle(x - 55, y, 58, 0x3d9a42));
    this.addQuestionObject(this.add.circle(x + 55, y, 58, 0x3d9a42));
    this.addQuestionObject(this.add.circle(x, y + 35, 64, 0x2f8f38));

    // Fruit
    const fruitPositions = [
        [-42, -62],
        [-12, -78],
        [18, -70],
        [46, -48],

        [-68, -18],
        [-35, -10],
        [-2, -22],
        [32, -8],
        [62, 6],

        [-52, 28],
        [-18, 36],
        [16, 32],
        [48, 42]
    ];

    fruitPositions.forEach(pos => {

        const fruit = this.add.circle(
            x + pos[0],
            y + pos[1],
            6,
            0xb22222
        );

        fruit.setStrokeStyle(1, 0x000000);

        this.addQuestionObject(fruit);
    });
}

showFloodPreparationQuestion ()
{
    this.clearQuestionScreen();

    this.addQuestionObject(this.add.rectangle(640, 360, 1120, 560, 0xffffff))
        .setStrokeStyle(4, 0x000000);

    // Tree and sticks randomized in opposite top corners, no labels
    this.drawFloodTaskTree(this.floodTaskSides.treeX, 165);
    this.drawStickPile(this.floodTaskSides.sticksX, 275);

    // People in the middle, no labels, no baskets
    this.addQuestionObject(this.createStaticHumanAvatar(470, 275, '', 0.82, 0xcc3333, 0, false));
    this.addQuestionObject(this.createStaticHumanAvatar(640, 275, '', 0.76, 0x3366cc, 0, false));
    this.addQuestionObject(this.createStaticHumanAvatar(810, 275, '', 0.70, 0x339966, 0, false));

    this.addQuestionObject(this.add.text(
        640,
        400,
        'क्या समूह को दिन का बाकी समय खाने के लिए अधिक भोजन खोजने में बिताना चाहिए या कुछ सप्ताह बाद आने वाली बाढ़ का सामना करने के लिए इस स्थान को तैयार करने में?',
        {
            fontSize: '27px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 980 },
            lineSpacing: 6
        }
    ).setOrigin(0.5));

    const answers = Phaser.Utils.Array.Shuffle([
    'समूह को दिन का बाकी समय खाने के लिए अधिक भोजन खोजने में बिताना चाहिए।',
    'समूह को दिन का बाकी समय दो सप्ताह बाद आने वाली बाढ़ का सामना करने के लिए इस स्थान को तैयार करने में बिताना चाहिए।'
    ]);

    this.createAnswerButton(640, 500, answers[0], 'floodPreparationChoice');
    this.createAnswerButton(640, 580, answers[1], 'floodPreparationChoice');
}

showPersonDInstructionScreen ()
{
    this.clearQuestionScreen();

    this.addQuestionObject(this.add.rectangle(640, 360, 1120, 560, 0xffffff))
        .setStrokeStyle(4, 0x000000);

    this.addQuestionObject(this.add.text(
        640,
        165,
        'एक नया व्यक्ति (व्यक्ति D) समूह के स्थान पर आता है और भोजन की भीख माँगता है। यह नया व्यक्ति शांतिपूर्ण है और कोई खतरा नहीं है।',
        {
            fontSize: '27px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 980 },
            lineSpacing: 6
        }
    ).setOrigin(0.5));

    this.addQuestionObject(this.createStaticHumanAvatar(240, 375, 'व्यक्ति A', 0.78, 0xcc3333, 0, false));
    this.addQuestionObject(this.createStaticHumanAvatar(395, 355, 'व्यक्ति B', 0.72, 0x3366cc, 0, false));

    this.drawSmallFire(395, 525, 0.75);

    this.addQuestionObject(this.createStaticHumanAvatar(535, 390, 'व्यक्ति C', 0.66, 0x339966, 0, false));

    this.addQuestionObject(this.createPersonDOutstretchedAvatar(1050, 355, 'व्यक्ति D', 0.66, 0x8a5a44));

    this.createNextButton(640, 675, 'अगला', () => {
        this.showPersonDShareQuestion();
    });
}

showPersonDShareQuestion ()
{
    this.clearQuestionScreen();

    this.addQuestionObject(this.createPersonDOutstretchedAvatar(640, 125, 'व्यक्ति D', 0.82, 0x8a5a44));

    this.addQuestionObject(this.add.rectangle(640, 425, 1120, 300, 0xffffff))
        .setStrokeStyle(4, 0x000000);

    this.addQuestionObject(this.add.text(
        640,
        325,
        'क्या समूह के सदस्यों को अपना भोजन व्यक्ति D के साथ साझा करना चाहिए या व्यक्ति D से कहीं और भोजन खोजने के लिए कहना चाहिए?',
        {
            fontSize: '27px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 980 },
            lineSpacing: 6
        }
    ).setOrigin(0.5));

    const answers = Phaser.Utils.Array.Shuffle([
    'समूह के सदस्यों को अपना भोजन व्यक्ति D के साथ साझा करना चाहिए।',
    'समूह के सदस्यों को व्यक्ति D से कहीं और भोजन खोजने के लिए कहना चाहिए।'
    ]);

    this.createAnswerButton(640, 435, answers[0], 'personDShareChoice');
    this.createAnswerButton(640, 525, answers[1], 'personDShareChoice');
}

createPersonDOutstretchedAvatar (x, y, label, scale, shirtColor)
{
    const person = this.add.container(x, y);

    const skinColor = 0xd9a06f;
    const hairColor = 0x6b3f1d;
    const pantsColor = 0x333333;

    person.add(this.add.rectangle(0, -18 * scale, 10 * scale, 14 * scale, skinColor));
    person.add(this.add.circle(0, -43 * scale, 24 * scale, skinColor));

    person.add(this.add.ellipse(0, -64 * scale, 46 * scale, 18 * scale, hairColor));
    person.add(this.add.ellipse(-17 * scale, -55 * scale, 12 * scale, 18 * scale, hairColor));
    person.add(this.add.ellipse(17 * scale, -55 * scale, 12 * scale, 18 * scale, hairColor));

    // Eyes looking left toward the group
person.add(this.add.circle(-14 * scale, -43 * scale, 2.7 * scale, 0x000000));
person.add(this.add.circle(-2 * scale, -43 * scale, 2.7 * scale, 0x000000));

// Nose shifted left
person.add(this.add.rectangle(-6 * scale, -35 * scale, 3 * scale, 9 * scale, 0x9b5c2e));

// Mouth shifted left
person.add(this.add.arc(-6 * scale, -25 * scale, 9 * scale, 20, 160, false, 0x000000));

    person.add(this.add.rectangle(0, 8 * scale, 42 * scale, 60 * scale, shirtColor));

    // Person D's arm outstretched toward the group
    person.add(this.add.rectangle(-42 * scale, -2 * scale, 58 * scale, 9 * scale, skinColor).setAngle(8));

    // Right arm down
    person.add(this.add.rectangle(30 * scale, 13 * scale, 9 * scale, 48 * scale, skinColor).setAngle(-12));

    // Straight legs
    person.add(this.add.rectangle(-12 * scale, 71 * scale, 13 * scale, 48 * scale, pantsColor));
    person.add(this.add.rectangle(12 * scale, 71 * scale, 13 * scale, 48 * scale, pantsColor));

    person.add(this.add.text(0, 130 * scale, label, {
        fontSize: '24px',
        color: '#000000'
    }).setOrigin(0.5));

    return person;
}

drawSmallFire (x, y, scale = 1)
{
    this.addQuestionObject(this.add.rectangle(x, y + 35 * scale, 120 * scale, 16 * scale, 0x8b5a2b))
        .setAngle(8);

    this.addQuestionObject(this.add.rectangle(x, y + 35 * scale, 120 * scale, 16 * scale, 0x8b5a2b))
        .setAngle(-8);

    this.addQuestionObject(this.add.triangle(
        x,
        y,
        0,
        55 * scale,
        28 * scale,
        -28 * scale,
        56 * scale,
        55 * scale,
        0xff7a00
    ));

    this.addQuestionObject(this.add.triangle(
        x,
        y + 8 * scale,
        0,
        38 * scale,
        19 * scale,
        -20 * scale,
        38 * scale,
        38 * scale,
        0xffd24a
    ));
}

showPersonDEmpathyQuestion ()
{
    this.clearQuestionScreen();

    this.addQuestionObject(
        this.createPersonDOutstretchedAvatar(
            640,
            125,
            'व्यक्ति D',
            0.82,
            0x8a5a44
        )
    );

    this.addQuestionObject(this.add.rectangle(640, 450, 1120, 350, 0xffffff))
        .setStrokeStyle(4, 0x000000);

    this.addQuestionObject(this.add.text(
        640,
        325,
        'क्या समूह अधिक लोगों के जीवित रहने की संभावना को अधिकतम करता है यदि वे व्यक्ति D के प्रति गहरी सहानुभूति महसूस करें या यदि वे व्यक्ति D के प्रति अपनी सहानुभूति सीमित रखें?',
        {
            fontSize: '26px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 980 },
            lineSpacing: 6
        }
    ).setOrigin(0.5));

const answers = Phaser.Utils.Array.Shuffle([
    'यदि समूह व्यक्ति D के प्रति गहरी सहानुभूति महसूस करता है, तो वह अधिक लोगों के जीवित रहने की संभावना को अधिकतम करता है।',
    'यदि समूह व्यक्ति D के प्रति न्यूनतम सहानुभूति महसूस करता है, तो वह अधिक लोगों के जीवित रहने की संभावना को अधिकतम करता है।'
]);

    this.createAnswerButton(640, 445, answers[0], 'personDEmpathyChoice');
    this.createAnswerButton(640, 540, answers[1], 'personDEmpathyChoice');
}

showCooperationCompetitionInstructionScreen ()
{
    this.clearQuestionScreen();

    const cooperativeOnLeft = Phaser.Math.Between(0, 1) === 0;

    const leftX = 345;
    const rightX = 935;
    const panelY = 370;

    this.addQuestionObject(this.add.rectangle(640, 360, 1120, 560, 0xffffff))
        .setStrokeStyle(4, 0x000000);

    this.addQuestionObject(this.add.text(
        640,
        120,
        'अधिकांश लोग कभी-कभी दूसरों के साथ सहयोग करते हैं और कभी-कभी दूसरों के साथ प्रतिस्पर्धा करते हैं।',
        {
            fontSize: '27px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 900 },
            lineSpacing: 6
        }
    ).setOrigin(0.5));

    this.drawCooperationCompetitionPanel(cooperativeOnLeft ? leftX : rightX, panelY, true);
    this.drawCooperationCompetitionPanel(cooperativeOnLeft ? rightX : leftX, panelY, false);

    this.createNextButton(640, 675, 'अगला', () => {
        this.showCooperationCompetitionQuestion();
    });
}

drawCooperationCompetitionPanel (x, y, cooperative)
{
    const panel = this.add.rectangle(x, y, 500, 330, 0xf8f8f8);
    panel.setStrokeStyle(3, 0x000000);
    panel.setDepth(1);
    this.addQuestionObject(panel);

    if (cooperative)
    {
        // Person A
        this.addQuestionObject(
            this.createPanelAvatar(
                x - 85,
                y + 45,
                '',
                0.72,
                0xcc3333,
                'smile',
                'right'
            )
        );

        // Person C closer to A
        this.addQuestionObject(
            this.createPanelAvatar(
                x + 10,
                y + 45,
                '',
                0.72,
                0x339966,
                'smile',
                'left'
            )
        );

        // Person B lower (same vertical level)
        this.addQuestionObject(
            this.createPanelAvatar(
                x + 135,
                y + 45,
                '',
                0.72,
                0x3366cc,
                'smile',
                'down'
            )
        );

        // Handshake
        const handshake = this.add.circle(x - 35, y + 42, 5, 0xd9a06f);
        handshake.setDepth(20);
        this.addQuestionObject(handshake);
    }
    else
    {
        // Person B lower (same vertical level)
        this.addQuestionObject(
            this.createPanelAvatar(
                x - 145,
                y + 45,
                '',
                0.72,
                0x3366cc,
                'scowl',
                'down'
            )
        );

        // Person A
        this.addQuestionObject(
            this.createPanelAvatar(
                x - 35,
                y + 45,
                '',
                0.72,
                0xcc3333,
                'scowl',
                'right'
            )
        );

        // Person C closer to A
        this.addQuestionObject(
            this.createPanelAvatar(
                x + 55,
                y + 45,
                '',
                0.72,
                0x339966,
                'scowl',
                'left'
            )
        );

        // Small food piece between A and C
        const food = this.add.circle(x + 10, y + 42, 5.5, 0xb22222);

        food.setStrokeStyle(1, 0x000000);
        food.setDepth(20);

        this.addQuestionObject(food);
    }
}

createPanelAvatar (x, y, label, scale, shirtColor, expression, armPose)
{
    const person = this.add.container(x, y);
    person.setDepth(10);

    const skinColor = 0xd9a06f;
    const hairColor = 0x6b3f1d;
    const pantsColor = 0x333333;

    person.add(this.add.rectangle(0, -18 * scale, 10 * scale, 14 * scale, skinColor));
    person.add(this.add.circle(0, -43 * scale, 24 * scale, skinColor));

    person.add(this.add.ellipse(0, -64 * scale, 46 * scale, 18 * scale, hairColor));
    person.add(this.add.ellipse(-17 * scale, -55 * scale, 12 * scale, 18 * scale, hairColor));
    person.add(this.add.ellipse(17 * scale, -55 * scale, 12 * scale, 18 * scale, hairColor));

    person.add(this.add.circle(-8 * scale, -43 * scale, 2.7 * scale, 0x000000));
    person.add(this.add.circle(8 * scale, -43 * scale, 2.7 * scale, 0x000000));

    person.add(this.add.rectangle(0, -35 * scale, 3 * scale, 9 * scale, 0x9b5c2e));

    if (expression === 'scowl')
{
    // Angry eyebrows
    person.add(
        this.add.rectangle(
            -8 * scale,
            -53 * scale,
            13 * scale,
            2 * scale,
            0x000000
        ).setAngle(18)
    );

    person.add(
        this.add.rectangle(
            8 * scale,
            -53 * scale,
            13 * scale,
            2 * scale,
            0x000000
        ).setAngle(-18)
    );

    // Frown
    const mouth = this.add.graphics();

    mouth.lineStyle(2, 0x000000);

    mouth.beginPath();
    mouth.arc(
        0,
        -18 * scale,
        9 * scale,
        Phaser.Math.DegToRad(200),
        Phaser.Math.DegToRad(340),
        true
    );

    mouth.strokePath();

    person.add(mouth);
}
else
{
    // Smile
    const mouth = this.add.graphics();

    mouth.lineStyle(2, 0x000000);

    mouth.beginPath();
    mouth.arc(
        0,
        -36 * scale,
        10 * scale,
        Phaser.Math.DegToRad(20),
        Phaser.Math.DegToRad(160),
        false
    );

    mouth.strokePath();

    person.add(mouth);
}

    person.add(this.add.rectangle(0, 8 * scale, 46 * scale, 64 * scale, shirtColor));

    if (armPose === 'right')
    {
        person.add(this.add.rectangle(-32 * scale, 10 * scale, 10 * scale, 52 * scale, skinColor));
        person.add(this.add.rectangle(38 * scale, -2 * scale, 58 * scale, 9 * scale, skinColor).setAngle(-7));
    }
    else if (armPose === 'left')
    {
        person.add(this.add.rectangle(32 * scale, 10 * scale, 10 * scale, 52 * scale, skinColor));
        person.add(this.add.rectangle(-38 * scale, -2 * scale, 58 * scale, 9 * scale, skinColor).setAngle(7));
    }
    else
    {
        person.add(this.add.rectangle(-32 * scale, 10 * scale, 10 * scale, 52 * scale, skinColor));
        person.add(this.add.rectangle(32 * scale, 10 * scale, 10 * scale, 52 * scale, skinColor));
    }

    person.add(this.add.rectangle(-12 * scale, 71 * scale, 14 * scale, 48 * scale, pantsColor));
    person.add(this.add.rectangle(12 * scale, 71 * scale, 14 * scale, 48 * scale, pantsColor));

    this.addQuestionObject(person);
    return person;
}

showCooperationCompetitionQuestion ()
{
    this.clearQuestionScreen();

    const fixedFood = this.getFixedFoodCounts();

const personADisplayFood = fixedFood.personA;
const personBDisplayFood = fixedFood.personB;
const personCDisplayFood = fixedFood.personC;

    this.addQuestionObject(this.createStaticHumanAvatar(280, 115, 'व्यक्ति A', 0.78, 0xcc3333, personADisplayFood));
    this.addQuestionObject(this.createStaticHumanAvatar(640, 115, 'व्यक्ति B', 0.72, 0x3366cc, personBDisplayFood));
    this.addQuestionObject(this.createStaticHumanAvatar(1000, 115, 'व्यक्ति C', 0.66, 0x339966, personCDisplayFood));

    this.addQuestionObject(this.add.rectangle(640, 455, 1120, 360, 0xffffff))
        .setStrokeStyle(4, 0x000000);

    this.addQuestionObject(this.add.text(
        640,
        330,
        'क्या आपको लगता है कि इस समूह के लोग संभवतः अधिक सहयोगी हैं या अधिक प्रतिस्पर्धी?',
        {
            fontSize: '28px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 980 },
            lineSpacing: 6
        }
    ).setOrigin(0.5));

    const answers = Phaser.Utils.Array.Shuffle([
'इस समूह के लोग संभवतः अधिक प्रतिस्पर्धी हैं।',
'इस समूह के लोग संभवतः अधिक सहयोगी हैं।'
    ]);

    this.createAnswerButton(640, 455, answers[0], 'cooperationCompetitionChoice');
    this.createAnswerButton(640, 560, answers[1], 'cooperationCompetitionChoice');
}

saveGameDataToGoogleSheets()
{
    const googleScriptUrl =
        'https://script.google.com/macros/s/AKfycbwO9F3j1BbvAX9waeMDTvEvEJWgu5YBezn4yPIhEctQgZwKOAooIybBoBhA7Cj7RHPRXA/exec';

    this.gameData.saveStatus =
        'attempted';

    console.log(
        'GOOGLE SCRIPT URL:',
        googleScriptUrl
    );

    console.log(
        'DATA BEING SENT:',
        JSON.stringify(this.gameData)
    );

    return fetch(
        googleScriptUrl,
        {
            method: 'POST',
            mode: 'no-cors',
            body:
                JSON.stringify(this.gameData)
        }
    );
}

showFinalGameScreen ()
{
    this.clearQuestionScreen();

    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    const gameId =
        urlParams.get('game_id');

    this.gameData.gameId =
        gameId;

    this.gameData.gameEndTime =
        new Date().toISOString();

    this.gameData.totalDurationMs =
        new Date(this.gameData.gameEndTime) -
        new Date(this.gameData.gameStartTime);

    this.saveGameDataToGoogleSheets()
    .then(() => {
        console.log('Google Sheets save request sent.');
    })
    .catch(error => {
        console.error('Google Sheets save failed:', error);
    });

    console.log(
        'FINAL GAME DATA:',
        this.gameData
    );

    this.addQuestionObject(
        this.add.rectangle(
            640,
            360,
            1000,
            500,
            0xffffff
        )
        .setStrokeStyle(
            4,
            0x000000
        )
    );

    const statusText =
        this.add.text(
            640,
            270,
            'सर्वाइवल गेम पूरा करने के लिए धन्यवाद।\n\nआपकी प्रतिक्रियाएँ सहेजी जा रही हैं...',
            {
                fontSize: '30px',
                color: '#000000',
                align: 'center',
                wordWrap:
                {
                    width: 850
                },
                lineSpacing: 10
            }
        )
        .setOrigin(0.5);

    this.addQuestionObject(statusText);

    this.time.delayedCall(
        2000,
        () =>
        {
            statusText.setText(
                'सर्वाइवल गेम पूरा करने के लिए धन्यवाद।\n\nआपकी प्रतिक्रियाएँ सहेज ली गई हैं।\n\nकृपया इस टैब को बंद करें और सर्वेक्षण पर वापस जाएँ।'
            );

            const closeButton =
                this.add.rectangle(
                    640,
                    540,
                    360,
                    65,
                    0x000000
                );

            closeButton.setInteractive(
                {
                    useHandCursor: true
                }
            );

            closeButton.setDepth(50);

            const closeText =
                this.add.text(
                    640,
                    540,
                    'गेम टैब बंद करें',
                    {
                        fontSize: '28px',
                        color: '#ffffff'
                    }
                )
                .setOrigin(0.5);

            closeText.setInteractive(
                {
                    useHandCursor: true
                }
            );

            closeText.setDepth(51);

            this.addQuestionObject(closeButton);
            this.addQuestionObject(closeText);

            const closeGameTab =
                () =>
                {
                    window.close();

                    this.addQuestionObject(
                        this.add.text(
                            640,
                            630,
                            'यदि यह टैब अपने आप बंद नहीं होता है, तो इसे मैन्युअल रूप से बंद करें और सर्वेक्षण टैब पर वापस जाएँ।',
                            {
                                fontSize: '22px',
                                color: '#000000',
                                align: 'center',
                                wordWrap:
                                {
                                    width: 850
                                }
                            }
                        )
                        .setOrigin(0.5)
                    );
                };

            closeButton.on(
                'pointerdown',
                closeGameTab
            );

            closeText.on(
                'pointerdown',
                closeGameTab
            );
        }
    );
}

    createAnswerButton (centerX, centerY, label, variableName)
{
    const paddingX = 24;
    const paddingY = 14;

    const text = this.add.text(
        centerX,
        centerY,
        label,
        {
            fontSize: '22px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: 880 }
        }
    ).setOrigin(0.5);

    const button = this.add.rectangle(
        centerX,
        centerY,
        text.width + paddingX * 2,
        text.height + paddingY * 2,
        0xdddddd
    );

    button.setStrokeStyle(2, 0x000000);
    button.setInteractive({ useHandCursor: true });

    button.setDepth(1);
    text.setDepth(2);

    this.addQuestionObject(button);
    this.addQuestionObject(text);

    if (!this.answerButtons[variableName])
    {
        this.answerButtons[variableName] = [];
    }

    this.answerButtons[variableName].push(button);

    button.on('pointerdown', () => {

        this.answerButtons[variableName].forEach(choice => {
            choice.setStrokeStyle(2, 0x000000);
        });

        button.setStrokeStyle(5, 0x000000);

        this.gameData[variableName] = label;

        console.log(
            'Saved answer:',
            variableName,
            label
        );

        if (this.currentNextButton)
        {
            this.currentNextButton.destroy();
            this.currentNextButton = null;
        }

        if (this.currentNextText)
        {
            this.currentNextText.destroy();
            this.currentNextText = null;
        }

            const addNext = (callback, y = 675) => {
    this.createNextButton(
        640,
        y,
        'अगला',
        callback
    );

            this.currentNextButton.setInteractive({
                useHandCursor: true
            });

            this.currentNextButton.setDepth(1000);

            this.currentNextText = this.add.text(
                640,
                y,
                'अगला',
                {
                    fontSize: '28px',
                    color: '#ffffff'
                }
            ).setOrigin(0.5);

            this.currentNextText.setInteractive({
                useHandCursor: true
            });

            this.currentNextText.setDepth(1001);

            this.addQuestionObject(this.currentNextButton);
            this.addQuestionObject(this.currentNextText);

            this.currentNextButton.on('pointerdown', callback);
            this.currentNextText.on('pointerdown', callback);
        };

        if (variableName === 'totalFoodEstimate')
        {
            addNext(() => this.showEqualDivisionTask());
        }
        else if (variableName === 'perCapitaEstimate')
        {
            addNext(() => this.showEqualDivisionSurvivalQuestion());
        }
        else if (variableName === 'equalDivisionSurvival')
        {
            addNext(() => this.showSurvivalGoalReminderScreen());
        }
        else if (variableName === 'groupDistributionPreference')
        {
            addNext(() => this.showUpperClassRedistributionQuestion());
        }
        else if (variableName === 'upperClassRedistribution')
        {
            addNext(() => this.showSocialContractQuestion());
        }
        else if (variableName === 'socialContractGuarantee')
        {
            addNext(() => this.showPersonalVsGroupResponsibilityQuestion());
        }
        else if (variableName === 'personalVsGroupResponsibility')
        {
            addNext(() => this.showFairRuleQuestion());
        }
        else if (variableName === 'fairRuleChoice')
        {
            addNext(() => this.showFoodRankReminderScreen());
        }
        else if (variableName === 'foodPriorityChoice')
        {
            addNext(() => this.showHardWorkReminderScreen(), 675);
        }
        else if (variableName === 'workBreakChoice')
        {
            addNext(() => this.showFloodRiskInstructionScreen());
        }
        else if (variableName === 'floodPreparationChoice')
        {
            addNext(() => this.showPersonDInstructionScreen());
        }
        else if (variableName === 'personDShareChoice')
        {
            addNext(() => this.showPersonDEmpathyQuestion());
        }
        else if (variableName === 'personDEmpathyChoice')
        {
            addNext(() => this.showCooperationCompetitionInstructionScreen());
        }
        else if (variableName === 'cooperationCompetitionChoice')
        {
            addNext(() => this.showFinalGameScreen());
        }
        else
        {
            this.showEndMessage();
        }
    });
}

getButtonStyle ()
{
    return {
        width: 220,
        height: 60,
        fontSize: '28px',
        fillColor: 0x000000,
        textColor: '#ffffff'
    };
}

createNextButton (x, y, label, callback)
{
    const style = this.getButtonStyle();

    const button =
        this.add.rectangle(
            x,
            y,
            style.width,
            style.height,
            style.fillColor
        );

    button.setInteractive({ useHandCursor: true });
    button.setDepth(1000);

    const text =
        this.add.text(
            x,
            y,
            label,
            {
                fontSize: style.fontSize,
                color: style.textColor
            }
        ).setOrigin(0.5);

    text.setInteractive({ useHandCursor: true });
    text.setDepth(1001);

    this.addQuestionObject(button);
    this.addQuestionObject(text);

    button.on('pointerdown', callback);
    text.on('pointerdown', callback);
}

createGameNextButton (x, y, label, callback)
{
    this.createNextButton(x, y, label, callback);
}

showNextTaskButtonAt (x, y, callback)
{
    const buttonY = 685;

    const button = this.add.rectangle(x, buttonY, 160, 55, 0x000000);
    button.setInteractive({ useHandCursor: true });
    button.setDepth(50);

    const text = this.add.text(x, buttonY, 'अगला', {
        fontSize: '28px',
        color: '#ffffff'
    }).setOrigin(0.5);

    text.setInteractive({ useHandCursor: true });
    text.setDepth(51);

    this.addQuestionObject(button);
    this.addQuestionObject(text);

    const goNext = () => {
        callback();
    };

    button.on('pointerdown', goNext);
    text.on('pointerdown', goNext);
}

showNextTaskButton (callback)
{
    const buttonY = 685;

    const button = this.add.rectangle(640, buttonY, 160, 55, 0x000000);
    button.setInteractive({ useHandCursor: true });
    button.setDepth(50);

    const text = this.add.text(640, buttonY, 'अगला', {
        fontSize: '28px',
        color: '#ffffff'
    }).setOrigin(0.5);

    text.setInteractive({ useHandCursor: true });
    text.setDepth(51);

    this.addQuestionObject(button);
    this.addQuestionObject(text);

    const goNext = () => {
        callback();
    };

    button.on('pointerdown', goNext);
    text.on('pointerdown', goNext);
}

createGameNextButton (x, y, label, callback)
{
    const buttonY = 685;

    const button = this.add.rectangle(x, buttonY, 160, 55, 0x000000);
    button.setInteractive({ useHandCursor: true });

    const text = this.add.text(x, buttonY, label, {
        fontSize: '28px',
        color: '#ffffff'
    }).setOrigin(0.5);

    button.setDepth(1);
    text.setDepth(2);

    this.addGameObject(button);
    this.addGameObject(text);

    button.on('pointerdown', callback);
    text.on('pointerdown', callback);
}

createNextButton (x, y, label, callback)
{
    const buttonY = 675;

    const button = this.add.rectangle(x, buttonY, 160, 55, 0x000000);
    button.setInteractive({ useHandCursor: true });
    button.setDepth(1000);

    const text = this.add.text(x, buttonY, label, {
        fontSize: '26px',
        color: '#ffffff'
    }).setOrigin(0.5);

    text.setInteractive({ useHandCursor: true });
    text.setDepth(1001);

    this.addQuestionObject(button);
    this.addQuestionObject(text);

    const goNext = () => {
        callback();
    };

    button.on('pointerdown', goNext);
    text.on('pointerdown', goNext);
}

    addQuestionObject (obj)
    {
        this.questionObjects.push(obj);
        return obj;
    }

    addGameObject (obj)
    {
        this.gameObjects.push(obj);
        return obj;
    }

    clearQuestionScreen ()
    {
        if (!this.questionObjects) return;

        this.questionObjects.forEach(obj => {
            if (obj && obj.destroy) obj.destroy();
        });

        this.questionObjects = [];
        this.answerButtons = [];
    }

    clearGameObjects ()
    {
        if (!this.gameObjects) return;

        this.gameObjects.forEach(obj => {
            if (obj && obj.destroy) obj.destroy();
        });

        this.gameObjects = [];
    }
}
