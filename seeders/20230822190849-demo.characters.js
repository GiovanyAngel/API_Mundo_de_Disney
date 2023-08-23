'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Characters', [
      {
        imagen: 'imagen_personaje_1.jpg',
        nombre: 'Mickey Mouse',
        edad: 92,
        peso: 25,
        historia: 'Personaje principal de todo Disney',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Characters', null, {});
  },
};
