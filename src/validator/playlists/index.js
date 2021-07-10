const { PlaylistPayloadSchema, PlaylistsongPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');
 
const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePlaylistsongPayload: (payload) => {
    const validationResult = PlaylistsongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
 
module.exports = PlaylistsValidator;
