const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: false,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            provider: {
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'local',
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
        /**
         * password 컬럼의 100 지정을 해준 이유는 나중에 암호화하여 저장하는 경우, 100글자 정도 되기 때문이다.
         */
        /**
         * timestamps속성이 true면 시퀄라이즈는 createdAt, updatedAt 컬럼을 추가한다.
            => 로우가 생서될 때와 수정될 때의 시간이 자동으로 입력된다.
         */
        /**
         * paranoid가 true로 설정하면, deletedAt column이 table에 추가됩니다.
            해당 row를 삭제시 실제로 데이터가 삭제되지 않고 deletedAt에 삭제된 날짜가 추가되며, deletedAt에 날짜가 표기된 row는 find 작업시 제외됩니다.
            즉, 데이터는 삭제되지 않지만 삭제된 효과를 줍니다.
            이 옵션은 timestamps 옵션이 true여야만 사용할 수 있습니다.
            // 실제 배포 시, 사용자가 복구 요청할 때 복구해줄 수 있게끔 해줄 수 있음
            https://victorydntmd.tistory.com/27
         */

    }

    static associate(db) {
        db.User.hasMany(db.Post);
        db.User.belongsToMany(db.User, {
            foreignKey: 'followingId',
            as: 'Followers',
            through: 'Follow',
        })
        db.User.belongsToMany(db.Uesr, {
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow',
        })
    }
};