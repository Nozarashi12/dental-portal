const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('lms_db', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});

// Users
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'client'), defaultValue: 'client' },
  phone: DataTypes.STRING(20),
  specialty: DataTypes.STRING(100),
  college: DataTypes.STRING(255),
  city: DataTypes.STRING(100),
  bio: DataTypes.TEXT,
}, { tableName: 'users', timestamps: true });

// Specialties
const Specialty = sequelize.define('Specialty', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
}, { tableName: 'specialties', timestamps: false });

// Courses
const Course = sequelize.define('Course', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  author: { type: DataTypes.STRING(255), allowNull: false },
  author_description: DataTypes.TEXT,
  cover_image: { type: DataTypes.STRING(255), allowNull: false },
  overview: { type: DataTypes.TEXT, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  category: { type: DataTypes.STRING(100), allowNull: false },
  specialty_id: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'courses', timestamps: true });

// Classrooms
const Classroom = sequelize.define('Classroom', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(255), allowNull: false },
  video_url: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  learning_objectives: { type: DataTypes.TEXT, allowNull: false },
  speaker: { type: DataTypes.STRING(255), allowNull: false },
  author_description: { type: DataTypes.TEXT, allowNull: false },
  published_date: { type: DataTypes.DATE, allowNull: false },
  expiration_date: DataTypes.DATE,
  discussion_enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  google_classroom_link: DataTypes.STRING(255),
  assessment_link: DataTypes.STRING(255),
}, { tableName: 'classrooms', timestamps: true });

// Enrollments
const Enrollment = sequelize.define('Enrollment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  enrolled_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, { tableName: 'enrollments', timestamps: false });

// Certificates
const Certificate = sequelize.define('Certificate', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
  issued_at: DataTypes.DATE,
}, { tableName: 'certificates', timestamps: false });

// Comments
const Comment = sequelize.define('Comment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  classroom_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.TEXT, allowNull: false },
}, { tableName: 'comments', timestamps: true });

// Associations
Course.belongsTo(Specialty, { foreignKey: 'specialty_id' });
Classroom.belongsTo(Course, { foreignKey: 'course_id' });
Enrollment.belongsTo(User, { foreignKey: 'user_id' });
Enrollment.belongsTo(Course, { foreignKey: 'course_id' });
Certificate.belongsTo(User, { foreignKey: 'user_id' });
Certificate.belongsTo(Course, { foreignKey: 'course_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });
Comment.belongsTo(Classroom, { foreignKey: 'classroom_id' });

module.exports = {
  sequelize,
  User,
  Specialty,
  Course,
  Classroom,
  Enrollment,
  Certificate,
  Comment,
};
