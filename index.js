const fs = require("fs");
const raritiesData = require("./rarities");
const traitKeys = Object.keys(raritiesData);


function generateAllTraitsJSON() {
    let alltTraitsArray = [];
    traitKeys.forEach(traitName => {
        const traitObject = raritiesData[traitName];
        alltTraitsArray.push({
            name: traitName,
            quantity: traitObject.length,
        });
        const allTraitsJsonText = JSON.stringify(alltTraitsArray);
        fs.writeFile("./data/traits.json", allTraitsJsonText, (err) => {
            if (err) throw err;
        });
    });
}

function generateSeperateTraitJSONS() {
    traitKeys.forEach(traitName => {
        const traitObject = raritiesData[traitName];
        traitObject.forEach(trait => {
            const occurrence = trait.occurrence.toString();
            const name = trait.trait.toString()
            trait.name = fromTitleCase(name, " ");
            if (occurrence.indexOf("in 4444 editions") > -1) {
                const lengthToRemove = "in 4444 editions".length + 2;
                const percentage = occurrence.slice(occurrence.indexOf("in 4444 editions") + lengthToRemove, occurrence.length - 3);
                // convert string to number and round to 2 decimal places
                const roundedPercentage = Math.round(parseFloat(percentage) * 100) / 100;
                trait.percentage = roundedPercentage;
            }
            trait.weight = Math.round(parseFloat(trait.weight) * 100) / 100;

            if (occurrence.indexOf("in 4444 editions") > -1) {
                const quantity = occurrence.slice(0, occurrence.indexOf("in 4444 editions"));
                const roundedQuantity = Math.round(parseFloat(quantity) * 100) / 100;
                trait.quantity = roundedQuantity;
            }
        });
        const traitJsonText = JSON.stringify(traitObject);
        const jsonFileName = `./data/${traitName}.json`;
        fs.writeFile(jsonFileName, traitJsonText, (err) => {
            if (err) throw err;
        });
    });

}

function fromTitleCase(str, separator) {
    return str.replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
        .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2');
}

// export functions from index.js   
module.exports = {
    generateAllTraitsJSON,
    generateSeperateTraitJSONS,
};
// get node arguments
const args = process.argv.slice(2);
// check if the first argument is a valid command
if (args[0] === "all") {

    generateAllTraitsJSON();
} else if (args[0] === "separate") {
    generateSeperateTraitJSONS();
} else {
    console.log("invalid command");
}   // end of if else
