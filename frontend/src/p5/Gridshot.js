import {Circle} from './p5components/Circle.js'
import { Grid } from './p5components/Grid.js';

export const Gridshot = (p, { gamemodeDataFilePath}) => {
    // Sketch variables
    let circles;
    let grid;

    // Gamemode Data Variables
    let numRows;
    let numCols;
    let xMin;
    let xMax;
    let yMin;
    let yMax;
    let numCircles;
    let circleRadius;

    
    //-----------Preload-----------//
    let gamemodeData;
    p.preload = () => {
        if (gamemodeDataFilePath){
            gamemodeData = p.loadJSON("./gamemodeData/" + gamemodeDataFilePath);
        } // Maybe raise error if this messes up or something
    }
    
    //-------------Setup------------//
    p.setup = () => {
        p.createCanvas(800,600)

        numRows = gamemodeData["numRows"];
        numCols = gamemodeData["numCols"];
        xMin = gamemodeData["xMin"];
        xMax = gamemodeData["xMax"];
        yMin = gamemodeData["yMin"];
        yMax = gamemodeData["yMax"];
        numCircles = gamemodeData["numCircles"];
        circleRadius = gamemodeData["circleRadius"];

        // Initialize Grid
        grid = new Grid(numRows, numCols, xMin, xMax, yMin, yMax);

        // Initialize circles
        circles = []
        for(let i = 0; i < numCircles; i++){
            addNewCircle()
        }
    }
    
    //-------------Draw--------------//
    p.draw = () => {
        p.background(200);

        for(let i = 0; i < circles.length; i++){
            circles[i][0].draw();
        }

    }
    
    //-------------MousePressed------------//
    p.mousePressed = () => {
        for(let i = circles.length-1; i >= 0; i--){
            if (circles[i][0].isMouseHovering(p.mouseX, p.mouseY)){
                // Set grid value to unoccupied
                let row = circles[i][1];
                let col = circles[i][2];

                // Remove circle from list
                circles.splice(i,1);

                // Add new circle to grid
                addNewCircle();
                grid.setPointNotOccupied(row, col)
                break;
            }
        // If here, must be a miss
        // TODO: missclick functionality
        }
    }

    //---------------Utility----------------//
    function addNewCircle(){
        let row = p.int(p.random(0, numRows));
        let col = p.int(p.random(0, numCols));
        while(grid.isPointOccupied(row, col)){
            row = p.int(p.random(0, numRows));
            col = p.int(p.random(0, numCols));
        }
        grid.setPointOccupied(row, col);

        // Input variables to circle class
        let [x, y] = grid.getCoordinates(row,col);
        let xSpeed = 0;
        let ySpeed = 0;
        let color = p.color(p.random(255), p.random(255), p.random(255));
        circles.push([new Circle(p, x, y, xSpeed, ySpeed, circleRadius, color), row, col]);
    }
}

export default Gridshot;