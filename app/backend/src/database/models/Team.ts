import { Model, DataTypes } from 'sequelize';
import db from '.';

class Team extends Model {
  declare teamName: string;
}

Team.init({
  teamName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  tableName: 'teams',
  timestamps: false,
});

export default Team;
