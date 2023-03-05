module.exports = {
    default: {
        parallel: 2,
        format: ['html:cucumber-report.html'],
        paths: ['e2e/0.2.0/**/*.feature'],
        require: ['e2e/0.2.0/support/*.js'],
        publishQuiet: true
    }
}
