const express = require("express");
const fs = require('fs');
const app = express();
const PORT = 8080;



class Contenedor {
  constructor(filename) {
    this.filename = filename;
  }

  /* Metódos utiles, no requeridos en la consigna */
  async readFile() {
    try {
      let data = await fs.promises.readFile(this.filename, 'utf-8');
      data = JSON.parse(data);
      return data;
    } catch (err) {
      return [];
    }
  }

  async checkIfIdExists(data,id) {
    try {
      let positionId = data.findIndex(product => product.id === id);
      return positionId;
    } catch (err) {
      console.error(err);
    }
  }

  /* Metodos requeridos por la consigna */
  async getAll() {
    return await this.readFile();
  }

  async getById(id) {
    try {
      let data = await this.readFile();  
      let positionId = await this.checkIfIdExists(data,id);
        
        positionId == -1 ? console.log(`There's no a prodiuct with ID ${id}`) : console.log(data[positionId]);
    } catch (err) {
      console.error(err);
    }
  }

  async deleteById(id) {
    try {
      let data = await this.readFile();
      let positionId = await this.checkIfIdExists(data,id);
      
      if (positionId == -1) {
        console.error(`There's no a prodiuct with ID ${id}`);
      } else {
        data.splice(positionId, 1);
        await fs.promises.writeFile(this.filename, JSON.stringify(data));
        console.log(`The product with ID ${id} has been deleted`);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async save(product) {
    try {
        let newID;
        let data = await this.readFile();
        let positionId;
        
        if (data.length == 0 || !data){
            newID = 1;
        } else {
            newID = data[data.length-1].id + 1;
            positionId = await this.checkIfIdExists(data,newID);
            while(positionId != -1) {
                newID = newID+1
                positionId = await this.checkIfIdExists(data,newID);
            }
        }
        
        product.id = newID;
        data.push(product);

        await fs.promises.writeFile(this.filename, JSON.stringify(data))
        console.log(`A new product with ID ${newID} has been added`)

    } catch(err) {
        console.log(err)
    }

  }

  async deleteAll() {
    try{
      await fs.promises.writeFile(this.filename, "")
      console.log("All products have been deleted")
    } catch (err) {
      console.log(err)
    }
  }

}

const products = new Contenedor('productos.txt');

app.get('/', (req, res) => {
    res.send("Hello World")
})

app.get('/productos', (req,res) => {
    (
        async function() {
           res.send(await products.getAll())
        }
    )();
});


app.get('/productoRandom', (req,res) => {
    (
        async function() {
            let data = await products.readFile();
            let randomId = Math.floor(Math.random() *(data.length));
            res.send(data[randomId])
        }
    )();
})


const server = app.listen(PORT, () => {
    console.log(`Server is listening at ${PORT}`)
})

app.on("error", err => console.log(err));