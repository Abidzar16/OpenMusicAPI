/* eslint-disable camelcase */
 
exports.shorthands = undefined;
 
exports.up = (pgm) => {
  // membuat table collaborations
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlistid: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    userid: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
 
  pgm.addConstraint('collaborations', 'unique_playlist_id_and_user_id', 'UNIQUE(playlistid, userid)');
 
  pgm.addConstraint('collaborations', 'fk_collaborations.playlist_id_playlists_id', 'FOREIGN KEY(playlistid) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('collaborations', 'fk_collaborations.user_id_users.id', 'FOREIGN KEY(userid) REFERENCES users(id) ON DELETE CASCADE');
};
 
exports.down = (pgm) => {
  // menghapus tabel collaborations
  pgm.dropTable('collaborations');
};
