const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

/**
 * CallerSchema
 */
const CallerSchema = new mongoose.Schema({
    id: { type: Number, equired: true, unique: true, index: true },     // 고유번호
    counter_number: { type: Number, default: '', trim: true },          // 창구번호
    name: { type: String, default: '', trim: true },                    // 고객명
    is_called: { type: Boolean, default: false },                       // 호출여부
    created_at: { type: Date, default: Date.now },                      // 생성일자
    updated_at: { type: Date }                                          // 수정일자
},
{
    timestamps: {   // createdAt및 updatedAt속성 을 자동으로 관리하도록 지시 하는 옵션(https://masteringjs.io/tutorials/mongoose/timestamps)
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

/**
 * Validations
 */
CallerSchema.path('name').required(true, 'name 은 빈 값이 올 수 없습니다.');
 

autoIncrement.initialize(mongoose.connection);
CallerSchema.plugin(autoIncrement.plugin, {
    model: 'Caller',
    field: 'id',
    startAt: 1,
    increment: 1
});

module.exports = mongoose.model('Caller', CallerSchema);