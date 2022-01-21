
let model;
// red blue yellow , r b l
let targetLabel = 'r';

let state = 'collection';

let collectionArray = [];

let tmpX, tmpY;

function setup() {
    createCanvas(400, 400);


    /* default color red */
    fill(255, 0, 0)
    stroke(100, 0, 0)

    rectMode(CENTER);

    let options = {

        inputs: ['x', 'y'],
        outputs: ['label'],
        task: 'classification',
        //debug: 'true'
    }

    model = ml5.neuralNetwork(options)
    background(220);
}

function keyPressed() {
    if (key == 'r') {
        targetLabel = 'r'
        fill(255, 0, 0)
        stroke(100, 0, 0)
    } else if (key == 'b') {
        targetLabel = 'b'
        fill(0, 0, 255)
        stroke(0, 0, 100)
    } else if (key == 'y') {
        targetLabel = 'y'
        fill(255, 204, 0);
        stroke(100, 120, 0)
    }else if (key  == 't'){ 
        state = 'training';
        console.log('starting training');
        model.normalizeData();
        let options = {
            epochs: 100
        };
        model.train(options, whileTraining, finishedTraining);
    }
}


function mousePressed() {

    let inputs = {
        x: mouseX,
        y: mouseY
    };

    tmpX = mouseX;
    tmpY = mouseY;

    if (state == 'collection') {
        let target = {
            label: targetLabel
        };

        model.addData(inputs, target);
        ellipse(mouseX, mouseY, 5)
    }
    else if (state == 'prediction') {
        model.classify(inputs, gotResults);
    }
}


function gotResults(error, results){
    if (error) {
        console.error(error);
        return;
    }

    //console.log(results);
    getColor(results[0].label)
    ellipse(tmpX, tmpY, 10);

}

function whileTraining(epoch, loss) { 
   
    //console.log(epoch);
      
}

function finishedTraining() { 
    console.log('finished training.');
    state = 'prediction';

    noStroke()
    createMapPrediction();
}



function createMapPrediction()
{
    console.log('creating map');
    for(let x = 0 ; x <= width; x+=10)
    {
        for(let y = 0 ; y <= height; y+=10)
        {
            let c =((y/10)%2)*5
           model.classify({
                x:x,
                y:y
            }).then((r)=>{ 
                getColor(r[0].label)
                ellipse(x+c, y, 10);
            })

            

            
        }
    }

    console.log('map finished');
}

function getColor(letter)
{
    if (letter == 'r') {
        fill(255, 0, 0)
        //stroke(100, 0, 0)
    } else if (letter == 'b') {
        fill(0, 0, 255)
        //stroke(0, 0, 100)
    } else if (letter == 'y') {
        fill(255, 204, 0);
        //stroke(100, 120, 0)
    }
}