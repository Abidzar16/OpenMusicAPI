const mapDBToModel = ({ 
    id,
    title,
    year,
    performer,
    genre,
    duration,
    inserted_at,
    updated_at,
  }) => ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    insertedAt: inserted_at,
    updatedAt: updated_at,
  });


const mapPlaylistSongToModel = ({ 
  id,
  song_id,
  username,
}) => ({
  id,
  song_id,
  username,
});
   
module.exports = { mapDBToModel,mapPlaylistSongToModel };