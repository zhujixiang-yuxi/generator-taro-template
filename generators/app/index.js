const Generator = require('yeoman-generator')
const mkdirp = require('mkdirp')
const chalk = require('chalk') // 让console.log带颜色输出
const yosay = require('yosay')
const decamelize = require('decamelize')
const camelCase = require('camelcase')
const shell = require('shelljs')

// const copyFiles = async(src, dest) => {
//   // package.json 和 模板文件不拷贝，后续单独处理
//   const files = await glob(`${src}/**/!(package.json)`, { nodir: true });

//   files.forEach(async (file) => {
//       const dir = path.relative(src, file);
//       await fse.copy(file, path.join(dest, dir), { overwrite: true });
//   });

//   // .gitignore 点开头的文件单独拷贝
//   await fse.copySync(`${src}/.gitignore`, `${dest}/.gitignore`, { overwrite: true });
// };

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
    this.log(yosay(`感谢使用 ${chalk.red('taro-template')} generator!`))
    this.argument('appname', {
      type: String,
      required: false
    })
  }
  async prompting() {
    const answers = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: '请输入你的taro项目名',
        default: this.options.appname || 'taro-app' // Default to current folder name
      },
      {
        type: 'input',
        name: 'projectAuthor',
        message: '项目开发者',
        default: this.user.git.name(),
        store: true // 记住用户的选择
      },
      {
        type: 'input',
        name: 'projectDesc',
        message: '请描述你的项目'
      },
      {
        type: 'input',
        name: 'version',
        message: '请输入项目版本号',
        default: '0.1.0'
      },
      {
        type: 'input',
        name: 'appid',
        message: '请输入项目的appid',
        store: true
      }
    ])
    answers.name = decamelize(camelCase(answers.name), '-')
    this.answers = answers
  }

  async writing() {
    const { name, projectAuthor, projectDesc, appid, version } = this.answers
    //创建项目文件
    mkdirp(name)

    // 更改项目根目录为之前创建的文件夹
    this.destinationRoot(this.destinationPath(name))

    // copy package.json and update some values
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      {
        name: name || this.options.appname,
        author: projectAuthor,
        description: projectDesc
      }
    )

    this.fs.copyTpl(
      this.templatePath('_project.config.json'),
      this.destinationPath('project.config.json'),
      {
        name: name || this.options.appname,
        description: projectDesc,
        appid: appid
      }
    )

    this.fs.copyTpl(
      this.templatePath('_.gitignore'),
      this.destinationPath('.gitignore')
    )

    // copy all files starting with .{whaetever} (like .eslintrc)
    this.fs.copy(this.templatePath('src/.*'), this.destinationPath('./'))

    // copy all folders and their contents
    this.fs.copy(this.templatePath('src'), this.destinationPath('./'))
    // templates目录里，除模板文件外都无脑拷贝
    // await copyFiles(path.join(__dirname, 'templates'), this.destinationRoot());
  }

  // install() {
  //   this.npmInstall(['husky'], {'save-dev': true})
  // }

  end() {
    this.log('')
    this.log(`   cd ${this.answers.name} && git init`)
    shell.cd(this.destinationRoot())
    shell.exec('git init')
    this.log('')
    this.log('   🎉🎉 项目创建成功')
    this.log('')
    this.log(
      chalk.hex('#d33200')('   开发前请确认你已经安装了Taro的脚手架工具:')
    )
    this.log(chalk.hex('#99ee77')('   sudo npm install -g @tarojs/cli'))
    console.log('')
    this.log('   开始你的项目吧 😊')
    this.log(chalk.hex('#875efd')(`   cd ${this.answers.name}`))
    this.log(chalk.hex('#875efd')('   npm i'))
    this.log(chalk.hex('#875efd')('   npm run dev:weapp'))
    this.log('')
  }
}
