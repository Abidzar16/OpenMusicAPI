const { Pool } = require('pg');
const { nanoid } = require('nanoid');
// const { mapPlaylistToModel } = require("../../utils");

// Error
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const ClientError = require('../../exceptions/ClientError');

class PlaylistsService {
  constructor(collaborationService, cacheService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
    this._cacheService = cacheService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1,$2,$3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT p.id, p.name, u.username
      FROM (
          SELECT *
          FROM playlists
          ) p LEFT JOIN users u ON u.id = p.owner
          LEFT JOIN collaborations c ON c.playlistid = p.id
          WHERE p.owner = $1 OR c.userid = $1;
      `,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getPlaylistById(owner, playlistId) {
    const query = {
      text: `SELECT p.id, p.name, u.username
      FROM (
          SELECT *
          FROM playlists
          ) p LEFT JOIN users u ON u.id = p.owner
          LEFT JOIN collaborations c ON c.playlistid = p.id
          WHERE p.owner = $1 OR c.userid = $1 AND p.id = $2;
      `,
      values: [owner, playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async editPlaylistById(id, { name }) {
    const query = {
      text: 'UPDATE playlists SET name = $1 WHERE id = $2 RETURNING id',
      values: [name, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui playlist. Id tidak ditemukan');
    }
  }

  async deletePlaylistById(id) {

    /*
     * Menghapus semua lagu yang ada di dalam playlist
     * sebelum menghapus playlist
     */
    const query1 = {
      text: 'DELETE FROM playlistsongs WHERE playlistid = $1',
      values: [id],
    };
    await this._pool.query(query1);

    const query2 = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result2 = await this._pool.query(query2);

    if (!result2.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(playlistId, access) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];

    if (playlist.owner !== access) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }

  async addSongToPlaylist(songId, playlistId) {
    const id = `sp-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1,$2,$3) RETURNING id',
      values: [id, songId, playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    await this._cacheService.delete(`playlists:${playlistId}`);
    return result.rows[0].id;
  }

  async getSongsFromPlaylist(playlistId) {
    try {
      // mendapatkan catatan dari cache
      const result = await this._cacheService.get(`playlists:${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT s.id as id, s.title as title, s.performer as performer
        FROM (
            SELECT *
            FROM songs
            ) s JOIN playlistsongs ps 
        ON ps.songid = s.id
        WHERE ps.playlistid = $1;
        `,
        values: [playlistId],
      };
      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new NotFoundError('Lagu tidak ditemukan');
      }

      await this._cacheService.set(`playlists:${playlistId}`, JSON.stringify(result.rows));
      return result.rows;
    }
  }

  async removeSongFromPlaylistService(songId, playlistId) {
    const query1 = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };

    const result1 = await this._pool.query(query1);
    if (!result1.rows.length) {
      throw new ClientError('Lagu belum ada di database');
    }

    const query2 = {
      text: 'DELETE FROM playlistsongs WHERE songid = $1 AND playlistid = $2 RETURNING id',
      values: [songId, playlistId],
    };

    const result2 = await this._pool.query(query2);

    if (!result2.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus dari playlist. Lagu tidak ditemukan');
    }

    await this._cacheService.delete(`playlists:${playlistId}`);
  }
}

module.exports = PlaylistsService;
