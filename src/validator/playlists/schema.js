const Joi = require('joi');
 
const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required()
});

const PlaylistsongPayloadSchema = Joi.object({
  songId: Joi.string().required()
});

module.exports = { PlaylistPayloadSchema, PlaylistsongPayloadSchema };