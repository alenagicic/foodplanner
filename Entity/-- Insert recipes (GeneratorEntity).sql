-- Insert recipes (GeneratorEntity)
INSERT INTO generatortable (Heading, BodyRecipe, RatingRecipe, ImageRecipe) VALUES
('Pancakes', 'Mix flour, eggs, and milk to make the batter. Cook on a griddle.', '5 stars', 'pancakes.jpg'),
('Spaghetti Bolognese', 'Cook spaghetti and add a meat sauce with tomatoes and garlic.', '4.5 stars', 'spaghetti.jpg'),
('Chicken Curry', 'Cook chicken with spices and coconut milk. Serve with rice.', '4 stars', 'chicken_curry.jpg'),
('Caesar Salad', 'Toss lettuce with Caesar dressing, croutons, and parmesan.', '5 stars', 'caesar_salad.jpg'),
('Grilled Cheese Sandwich', 'Butter bread and grill with cheese in the middle.', '4 stars', 'grilled_cheese.jpg'),
('Tomato Soup', 'Cook tomatoes, onions, and garlic. Blend until smooth.', '5 stars', 'tomato_soup.jpg'),
('Beef Tacos', 'Cook beef with taco seasoning. Serve in taco shells with toppings.', '4 stars', 'beef_tacos.jpg'),
('Vegetable Stir Fry', 'Stir fry vegetables like bell peppers, broccoli, and carrots in soy sauce.', '4.5 stars', 'veg_stir_fry.jpg'),
('Fried Rice', 'Fry rice with vegetables, soy sauce, and eggs.', '4 stars', 'fried_rice.jpg'),
('Fish and Chips', 'Fry battered fish and serve with crispy fries.', '5 stars', 'fish_chips.jpg');

-- Insert tags (TagsEntity)
INSERT INTO tagtable (Tag, GeneratorId) VALUES
('Breakfast', 1),
('Comfort Food', 2),
('Dinner', 3),
('Salad', 4),
('Sandwich', 5),
('Soup', 6),
('Mexican', 7),
('Vegetarian', 8),
('Asian', 9),
('Fast Food', 10);

-- Add some more recipes with tags
INSERT INTO generatortable (Heading, BodyRecipe, RatingRecipe, ImageRecipe) VALUES
('Beef Stroganoff', 'Cook beef with mushrooms, onions, and sour cream.', '4 stars', 'beef_stroganoff.jpg'),
('Vegetable Soup', 'Cook vegetables with broth. Simmer until tender.', '4.5 stars', 'veg_soup.jpg'),
('Chicken Sandwich', 'Grill chicken and place it in a sandwich bun.', '4 stars', 'chicken_sandwich.jpg'),
('Lasagna', 'Layer pasta, cheese, and tomato sauce. Bake until bubbly.', '5 stars', 'lasagna.jpg'),
('Crispy Tofu', 'Deep fry tofu and serve with soy sauce and vegetables.', '4 stars', 'crispy_tofu.jpg'),
('Mushroom Risotto', 'Cook rice slowly with mushrooms, broth, and cheese.', '4.5 stars', 'mushroom_risotto.jpg'),
('BBQ Ribs', 'Cook ribs with barbecue sauce and grill until tender.', '5 stars', 'bbq_ribs.jpg'),
('Eggplant Parmesan', 'Layer fried eggplant with marinara sauce and cheese. Bake.', '4 stars', 'eggplant_parmesan.jpg'),
('Falafel', 'Fry chickpea balls and serve in pita with veggies and tahini.', '4.5 stars', 'falafel.jpg'),
('Pad Thai', 'Stir fry rice noodles with peanuts, egg, and a tangy sauce.', '5 stars', 'pad_thai.jpg');

INSERT INTO tagtable (Tag, GeneratorId) VALUES
('Dinner', 11),
('Soup', 12),
('Sandwich', 13),
('Italian', 14),
('Vegan', 15),
('Vegetarian', 16),
('BBQ', 17),
('Vegetarian', 18),
('Middle Eastern', 19),
('Asian', 20);

-- Continue with more recipes and tag assignments
-- Recipe 21 to 50 can follow the same structure with different Heading, BodyRecipe, RatingRecipe, ImageRecipe, and Tags
-- Adjusting the GeneratorId for each respective recipe, and associating appropriate tags with each one
