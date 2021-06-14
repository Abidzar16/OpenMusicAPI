/* eslint-disable camelcase */

exports.shorthands = undefined;
 
exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INT',
      notNull: true,
    },
    performer: {
      type: 'TEXT',
      notNull: true,
    },
    genre: {
        type: 'INT',
        notNull: true,
    },
    duration: {
        type: 'INT',
        notNull: true,
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
    },
    updated_at: {
      type: 'TIMESTAMP',
      notNull: true,
    },
  });
};
 
exports.down = (pgm) => {
  pgm.dropTable('songs');
};
