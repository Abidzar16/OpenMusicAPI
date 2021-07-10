/* eslint-disable camelcase */
 
exports.shorthands = undefined;
 
exports.up = (pgm) => {
  // membuat table collaborations
  pgm.createTable('playlistsongs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    songid: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    playlistid: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
 
  // Menambahkan constraint UNIQUE, Guna menghindari duplikasi data antara nilai keduanya.
  pgm.addConstraint('playlistsongs', 'unique_song_id_and_playlist_id', 'UNIQUE(songid, playlistid)');
 
  // memberikan constraint foreign key pada kolom note_id dan user_id terhadap notes.id dan users.id
  pgm.addConstraint('playlistsongs', 'fk_collaborations.song_id_songs.id', 'FOREIGN KEY(songId) REFERENCES songs(id) ON DELETE CASCADE');
  pgm.addConstraint('playlistsongs', 'fk_collaborations.playlist_id_playlists.id', 'FOREIGN KEY(playlistId) REFERENCES playlists(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    // menghapus tabel collaborations
    pgm.dropTable('playlistsongs');
  };

