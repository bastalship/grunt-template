module.exports = function(grunt) {
    const sass = require("node-sass"); // Bắc buộc khi cài đặt module sass
    // 01. Cấu hình cho tất cả các plugin.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        // Cấu hình đường dẫn thư mục
        dirs: {
            input: "src",
            inputJS: "src/js",
            inputCSS: "src/css",
            inputSCSS: "src/scss",
            inputHTML: "src/html",
            output: "build",
            outputJS: "build/js",
            outputCSS: "build/css"
        },
        // Plugin hỗ trợ nén các tập tin css thành 1 dòng.
        cssmin: {
            target: {
                files: [{
                    "<%= dirs.outputCSS %>/style.css": "<%= dirs.outputCSS %>/style.css"
                }]
            }
        },
        // Plugin hỗ trợ  gộp các file thành 1 file duy nhất
        concat: {
            options: {
                // stripBanners: true,
                // separator: ';',
            },
            dist: {
                src: ["<%= dirs.inputJS %>/js-01.js", "<%= dirs.inputJS %>/js-02.js"],
                dest: "<%= dirs.outputJS %>/main.js"
            }
        },
        // Uglify - Plugin hỗ trợ nén file javascript thành 1 dòng
        uglify: {
            my_target: {
                options: {
                    beautify: false,
                    compress: {
                        drop_console: true
                    }
                },
                files: {
                    "<%= dirs.outputJS %>/main.js": ["<%= dirs.inputJS %>/main.js"]
                }
            }
        },
        // SASS - Plugin hỗ trợ chuyển đổi các mã SCSS thành CSS
        sass: {
            options: {
                implementation: sass,
                sourceMap: false,
                outputStyle: "expanded"
            },
            files: {
                src: "<%= dirs.inputSCSS %>/style.scss",
                dest: "<%= dirs.outputCSS %>/style.css"
            }
        },
        // WATCH - Plugin hỗ trợ kiểm tra sự thay đổi ở các file được chỉ định sau dó sẽ cập nhật nội dung mới thông qua hiển thị trên trình duyệt
        watch: {
            options: {
                spawn: false,
                livereload: true
            },
            scripts: {
                files: ["<%= dirs.srcJS %>/*.js", "<%= dirs.srcJS %>/*/*.js"]
            },
            html: {
                files: ["<%= dirs.input %>/*.html", "<%= dirs.input %>/html-elements/*.html", "<%= dirs.input %>/html-elements/*/*.html"],
                tasks: ["includes", "htmlhint"]
            },
            fonts: {
                files: ["<%= dirs.input %>/fonts/**/*"],
                tasks: ["copy:fonts"]
            },
            images: {
                files: ["<%= dirs.input %>/images/**/*"],
                tasks: ["copy:images"]
            },
            scss: {
                files: ["<%= dirs.input %>/*.scss", "<%= dirs.input %>/*/*.scss"],
                tasks: ["sass"]
            }
        },
        // CONNECT - Plugin hỗ trợ tạo máy chủ ảo để truy cập đường dẫn rõ ràng
        connect: {
            server: {
                options: {
                    hostname: "localhost",
                    port: 3000,
                    base: "<%= dirs.output %>/",
                    livereload: true
                }
            }
        },
        // INCLUDE - Plugin cho phép tách bạch các mã HTML thành các file khác nhau sau đó gọi vào file chính thông qua mã lệnh include 'duong-dan.html'
        includes: {
            files: {
                src: ["<%= dirs.input %>/*.html"], // Source files
                dest: "<%= dirs.output %>/*.html", // Destination directory
                flatten: true,
                cwd: ".",
                options: {
                    silent: true
                }
            }
        },
        // HTML MIN - Plugin hỗ trợ nén các file HTML thành 1 dòng duy nhất
        htmlmin: {
            // Task
            dist: {
                // Target
                options: {
                    // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    // Dictionary of files
                    "<%= dirs.output %>/*.min.html": "<%= dirs.output %>/*.html" // 'destination': 'source'
                }
            }
        },
        // CLEAN - Plugin hỗ trợ xóa những tập tin hay thư mục ở build khi xóa ở thư mục src
        clean: ["<%= dirs.output %>", "!<%= dirs.output %>/fonts", "!<%= dirs.output %>/images"],
        // COPY - Plugin hỗ trợ copy file từ thư mục src sang thư mục build
        copy: {
            images: {
                files: [{
                    expand: true,
                    cwd: "<%= dirs.input %>/images/",
                    src: "**/*",
                    dest: "<%= dirs.output %>/images/"
                }]
            },
            fonts: {
                files: [{
                    expand: true,
                    cwd: "<%= dirs.input %>/fonts/",
                    src: "**/*",
                    dest: "<%= dirs.output %>/fonts/"
                }]
            }
        },
        // HTML HINT - Plugin hỗ trợ check validate mã html
        htmlhint: {
            options: {
                "tagname-lowercase": true,
                "attr-lowercase": true,
                "attr-value-double-quotes": true,
                "spec-char-escape": true,
                "id-unique": true,
                "src-not-empty": true,
                "img-alt-require": true
            },
            files: ["<%= dirs.output %>/*.html"]
        },
        // CSS LINT - Plugin hỗ trợ check validate mã css
        csslint: {
            options: {
                'important': false,
                'adjoining-classes': false,
                'known-properties': false,
                'box-sizing': false,
                'box-model': false,
                'overqualified-elements': false,
                'display-property-grouping': false,
                'bulletproof-font-face': false,
                'compatible-vendor-prefixes': false,
                'regex-selectors': false,
                'errors': false,
                'duplicate-background-images': false,
                'duplicate-properties': false,
                'empty-rules': false,
                'selector-max-approaching': false,
                'gradients': false,
                'fallback-colors': false,
                'font-sizes': false,
                'font-faces': false,
                'floats': false,
                'star-property-hack': false,
                'outline-none': false,
                'import': false,
                'ids': false,
                'underscore-property-hack': false,
                'rules-count': false,
                'qualified-headings': false,
                'selector-max': false,
                'shorthand': false,
                'text-indent': false,
                'unique-headings': false,
                'universal-selector': false,
                'unqualified-attributes': false,
                'vendor-prefix': false,
                'zero-units': false
            },
            files: ['<%= dirs.outputCSS %>/*.css']
        },
        // IMAGE MIN - Plugin hỗ trợ nén hình ảnh
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 7,
                    progressive: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= dirs.output %>/images/',
                    src: '**/*',
                    dest: '<%= dirs.output %>/images/'
                }]
            }
        },
    });
    // 02. Plugin nào muốn sử dụng sẽ được gọi ở đây.
    grunt.file.expand("./node_modules/grunt-*/tasks").forEach(grunt.loadTasks);
    // 03. Các plugin được thực thi bằng các lệnh command line được định nghĩa bên dưới
    /*
      Gõ: grunt - để chạy các tác vụ thứ nhất (1)
      Gõ: grunt dev - để chạy các tác vụ thứ (2)
      Gõ: grunt publish - để chạy các tác vụ thứ (3)
    */
    grunt.registerTask("default", ["clean", "includes", "htmlhint", "sass", "csslint", "uglify", "connect", "watch"]); // (1)
    grunt.registerTask("dev", ["default"]); // (2)
    grunt.registerTask("publish", ["cssmin", "uglify", "htmlmin", 'imagemin']); // (3)
};