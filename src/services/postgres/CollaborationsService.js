/* eslint-disable quotes */
/* eslint-disable no-underscore-dangle */
const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");

class CollaborationsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addCollaboration(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Kolaborasi gagal ditambahkan");
    }
    await this._cacheService.delete(`playlists:${playlistId}`);
    return result.rows[0].id;
  }

  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlistid = $1 AND userid = $2 RETURNING id',
      values: [playlistId, userId],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal dihapus');
    }
    await this._cacheService.delete(`playlists:${playlistId}`);
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: "SELECT * FROM collaborations WHERE playlistid = $1 AND userid = $2",
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Kolaborasi gagal diverifikasi");
    }
  }
}

module.exports = CollaborationsService;
