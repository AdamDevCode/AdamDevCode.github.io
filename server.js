const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const PORT = 3000;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

const Ingredient = sequelize.define('Ingredient', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price_per_unit: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

app.use(express.static('public'));
app.use(express.json());

app.get('/ingredients', async (req, res) => {
    const ingredients = await Ingredient.findAll();
    res.json(ingredients);
});

app.post('/calculate', async (req, res) => {
    const selectedIngredients = req.body;
    let totalCost = 0;

    for (const ingredient of selectedIngredients) {
        const ingredientData = await Ingredient.findOne({ where: { name: ingredient.name } });
        if (ingredientData) {
            totalCost += ingredientData.price_per_unit * ingredient.amount;
        }
    }

    res.json({ totalCost });
});

app.post('/update-ingredient', async (req, res) => {
    const { name, totalWeight, totalPrice } = req.body;
    const ingredient = await Ingredient.findOne({ where: { name } });
    if (ingredient) {
        ingredient.price_per_unit = totalPrice / totalWeight;
        await ingredient.save();
        res.json({ message: 'Ingredient updated successfully', ingredient });
    } else {
        res.status(400).json({ message: 'Ingredient not found' });
    }
});

app.post('/add-ingredient', async (req, res) => {
    const { name, unit, totalWeight, totalPrice } = req.body;
    try {
        const newIngredient = await Ingredient.create({
            name,
            unit,
            price_per_unit: totalPrice / totalWeight
        });
        res.json({ message: 'Ingredient added successfully', ingredient: newIngredient });
    } catch (error) {
        res.status(400).json({ message: 'Error adding ingredient', error });
    }
});

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
