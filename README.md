# Vue.js 스터디

## 목적

Vue.js 학습을 통해 V-DOM을 사용하여 Model을 편리하게 렌더링 하고  
클라이언트 자원을 효율적으로 활용하는 방법을 습득

<br/>

## 좋아요 이벤트 (튜토리얼)

- CDN 사용을 위한 스크립트 주입
  ```html
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  ```
- 데이터를 변경시 자동으로 **변경사항만 반영하여 렌더링**됨

  > 개발자는 **데이터의 변동사항**만 신경 써주면 된다  
  > 기존 JQuery와 같은 라이브러리만 사용했을때 보다 훨씬 편리함  
  > **데이터 중심적인 개발이 가능함**

- 좋아요 이벤트 code

  ```html
  <body>
      <div id="root">
          <div v-if="liked">좋아요 눌렀음</div>
          <button v-on:click="onClickButton" >좋아요</button>
      </div>
  </body>

  <script>
      const app = new Vue({
          el: '#root',
          data: {
              liked: true,
          },
          methods: {
              onClickButton(){
                  this.liked = !this.liked;
              },
          },
      });
  </script>
  // new Vue()를 통해 설정함
  // el 옵션을 통해 요소 지정
  // data 옵션으로 렌더링을 할때 추적할 data를 설정함
  // mehods
  ```

- v-{method} 속성은 **JS 명령어를 포함 및 호출** 할 수 있다
- v-if v-else 등의 옵션은 **인접한 형제 요소들** 끼리 적용이 된다

<br/>

## 구구단

- Vue 에서는 Data를 중점으로 사고하고 바뀌는 부분(새롭게 렌더링 되는 부분)에 집중한다.

  > 리액트에서의 **State** 개념으로 이해

- 구구단 code

  ```html
  <body>
    <div id="root">
        <div>{{firstNum}}곱하기 {{secondNum}}는?</div>
        <form action="" v-on:submit="onSubmitForm">
            <input type="number" v-model="value" ref="answer">
            <div>입력: {{value}}</div>
            <button type="submit" >입력</button>
            <div>결과: {{result}}</div>
        </form>
    </div>
  </body>

  <script>
      const app = new Vue({
          el: '#root',
          data: {
              firstNum: Math.ceil(Math.random()*9),
              secondNum: Math.ceil(Math.random()*9),
              value: '',
              result: '',
          },
          methods: {
              onSubmitForm(e){
                  e.preventDefault();
                  if (this.firstNum * this.secondNum === parseInt(this.value)){
                      this.result = "정답",
                      this.firstNum = Math.ceil(Math.random()*9),
                      this.firstNum = Math.ceil(Math.random()*9),
                      this.value = ''; //양방향 바인딩
                  }else {
                      this.result = "틀림!"
                  }
                  this.$refs.answer.focus();
              },
          },
      });
  </script>
  ```

  - html 태그 또는 컨텐츠 내부에서 data를 접근 가능
    > {{data}}, v-?="data" 과 같은 방식
  - 기본적으로 **양방향 데이터 바인딩**
  - data를 통해 렌더링을 유도할 수 없는 기능(EX input 요소 focus 제어 등)은 ref 옵션을 사용하여 제어 가능
    > ref의 **남용은 절대 금지**  
    > EX) ref.요소.value = '123123'  
    > 위와같이 data가 아닌 **요소를 직접 제어하여 값을 변경할 경우 새로 렌더링이 발생하지 않아 데이터와 뷰 간의 괴리**가 발생한다
  - mothods 에서는 'e'와 같은 이벤트 리스너를 사용 가능

<br/>

## 끝말잇기

- 끝말잇기 code

  ```html
  <body>
    <div id="root">
        <div>{{targetStr}}</div>
        <form v-on:submit="onSubmit">
            <input type="text" v-model="inputValue" ref="inputRef">
            <button type="submit">입력</button>
        </form>
        <div>결과: {{result}}</div>
    </div>
  </body>

  <script>
      const app = new Vue({
          el: '#root',
          data: {
              targetStr: '',
              inputValue: '',
              result: '',
          },
          methods: {
              onSubmit(e){
                  e.preventDefault();
                  if( this.targetStr === '' || this.targetStr[this.targetStr.length - 1] === this.inputValue[0] ){
                      this.result = '정답'
                      this.targetStr = this.inputValue
                  }else {
                      this.result = '땡!'
                  }
                  this.inputValue = ''
                  this.$refs.inputRef.focus();
              },
          },
      });
  </script>
  ```

  - 앞서 구구단 예제에서 학습한 내용으로 끝말잇기 구현

<br/>

## 컴포넌트

하나의 페이지의 N개의 끝말잇기 요소를 추가한다고 가정해보자.  
중복된 참조를 피하기 위해서 **N개만큼의 요소와 Vue 객체**를 불러와야 할것이다  
**이러한 문제를 해결하기 위해 컴포넌트의 사용은 필수적**

<br/>

- 끝말잇기(컴포넌트) code

  ```html
  <body>
      <div id="root">
          <word-relay start-word="첫번째"></word-relay>
          <br/>
          <word-relay start-word="두번째"></word-relay>
          <br/>
          <word-relay start-word="세번째"></word-relay>
          <br/>
      </div>
  </body>

  <script>
      Vue.component('word-relay',{
          template: `
          <div>
              <div>{{targetStr}}</div>
              <form v-on:submit="onSubmit">
                  <input type="text" v-model="inputValue" ref="inputRef">
                  <button type="submit">입력</button>
              </form>
              <div>결과: {{result}}</div>
          </div>
          `,
          props:['startWord'],
          data() {
              return{
                  targetStr: this.startWord,
                  inputValue: '',
                  result: '',
              }
          },
          methods: {
              onSubmit(e){
                  e.preventDefault();
                  if( this.targetStr === '' || this.targetStr[this.targetStr.length - 1] === this.inputValue[0] ){
                      this.result = '정답'
                      this.targetStr = this.inputValue
                  }else {
                      this.result = '땡!'
                  }
                  this.inputValue = ''
                  this.$refs.inputRef.focus();
              },
          },

      });
  </script>

  <script>
      const app = new Vue({
          el: '#root',
      });
  </script>
  ```

  기존 끝말잇기 Vue 인스턴스를 **컴포넌트로 분리** 시켰다.  
  이 과정을 통해 많은 것들을 학습 가능했다

- Vue.Component

  ```javascript
  Vue.component('word-relay',{
        template: `
        `,
        props:[],
        data() {
            return{}
        },
        methods: {},
        },
    });
  ```

  기본적인 Component 구조이다

  - template - 통해 컴포넌트 단위로 사용할 **html 요소**를 지정
  - props - 컴포넌트 마다 **각자의 특성**을 다르게 하기위해 전달하는 값들의 모임(선언)
  - data - 컴포넌트에서는 data를 반환하는 형식의 함수로 구성해야 한다. 이는 컴포넌트의 데이터의 중복없이 여러개를 사용하는 목적과 부합하는 부분이다

- ### Rules & Tips

  - template 속성은 반드시 **최상단 한개의 요소**로 묶여 있는 형태
  - ``(백틱)을 사용하여 줄바꿈을 편리하게 표기 가능
  - Vue는 Kebab-Case -> Camel-Case 자동 변환 지원

    ```html
    //html attribute
    <word-relay start-word="첫번째"></word-relay>

    //vue.component
    props:['startWord'],
    ```

    **start-word -> startWord** 자동 매핑된것 확인

  - 위 예시는 전역 컴포넌트 생성 예

</br>

## WebPack
Vue와 같은 프론트엔드 라이브러리(프레임워크) 사용시  
수많은 스크립트 파일을 관리할 수 밖에 없다. 이 과정에서 많은 문제가 발생하고, 프로젝트의 규모가 커질수록 문제는 심각해 진다.  
WebPack과 같은 번들러 형태의 개발 구조의 장점과 사용법을 익혀보자.

<br/>

- ### 모듈이란 무엇인가?
    - index.html
        ```html
        <body>
            <h1>Hello, Webpack</h1>
            <div id="root"></div>
            <script type="module">
                import hello_word from './source/hello.js';
                import world_word from'./source/world.js';
                document.querySelector('#root').innerHTML = hello_word+' '+world_word;
            </script>
        </body>
        ```
    - hello.js
        ```javascript
        var word = "Hello";
        export default word;
        ```
    - world.js
        ```javascript
        var word = "world";
        export default word;
        ```
    WebPack을 사용하지 않을때 사용하는 기본적인 모듈 구조이다.  
    hello.js, world.js 모두 word 라는 변수를 가지고 있기 때문에 module 구조로 사용하지 않는다면 중복이 되어 문제가 발생한다.  
      
    > 웹팩은 이러한 모듈구조를 편리하게 사용하게 해줌과 더불어 필요한 파일들을 통합하여 Output 해준다는 장점이 있다
    
    </br>
- WebPack 설치 후 코드 구성
    - index.html
        ```html
        <body>
            <h1>Hello, Webpack</h1>
            <div id="root"></div>
            <script src="./public/main.js"></script>
        </body>
        ```
    - index.js
        ```javascript
        import hello_word from "./hello.js";
        import world_word from "./world.js";
        document.querySelector("#root").innerHTML = hello_word + " " + world_word;
        ```
    - hello.js
        ```javascript
        var word = "Hello";
        export default word;
        ```
    - world.js
        ```javascript
        var word = "world";
        export default word;
        ```
    - webpack 번들링 실행 명령어
        ```cmd
        npx webpack --entry ./source/index.js --output-path ./public/
        ```
    - 생성된 main.js 
        ```javascript
        (()=>{"use strict";document.querySelector("#root").innerHTML="Hello world"})();
        ```
    index.html 에서는 **WebPack 으로부터 생성된 main.js** 한개의 파일만 호출해서 사용하면 된다. 덕분에 **module, import와 같은 구형 브라우저에서 지원되지 않는 명령어**를 사용하지 않아도 되고, **한개의 파일만 서버에 요청**하여 부담을 줄일 수 있다.

    <br/>
- webpack config 를 통한 설정
    - webpack.config.js
        ```javascript
        const path = require("path");

        module.exports = {
        mode: "development",
        entry: "./source/index.js",
        output: {
            path: path.resolve(__dirname, "public"),
            filename: "main.js",
        },
        };
        ```
    - 번들링 실행 명령
        ```
        npx webpack --config webpack.config.js
        ```
    번들링에 필요한 정보들을 따로 파일을 만들어 유지하고,  
    npx 명령을 통해 참조할 설정파일 정보를 넘겨준다.  
    공식문서: [https://webpack.js.org/concepts/configuration/](https://webpack.js.org/concepts/configuration/)

</br>

- 로더  
    Webpack은 JS 파일 뿐만 아니라 스타일, 프레임워크, 파일 등등 여러가지 형식들을 번들링에 포함할 수 있다.  
    - css 파일 로더에 등록하기
        - index.html
            ```html
            <html>
                <head>
                    <!-- <link rel="stylesheet" href="./public/style.css"> -->
                </head>
                <body>
                    <h1>Hello, Webpack</h1>
                    <div id="root"></div>
                    <script src="./public/main.js"></script>
                </body>
            </html>
            ```
        - webpack.config.js
            ```javascript
            const path = require("path");

            module.exports = {
            mode: "development",
            entry: "./source/index.js",
            output: {
                path: path.resolve(__dirname, "public"),
                filename: "main.js",
            },
            module: {
                rules: [
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                },
                ],
            },
            };
            ```
        - index.html 에서 css 호출 부문을 주석 처리를 했지만 Webpack 로더 기능을 사용했기 때문에 스타일이 잘 적용되었다.  
        - "css-loader"를 통해 css 파일을 번들링에 포함 시켰고, "style-loader"를 활용해 자동으로 html 파일에 스타일을 주입 시킬 수 있었다.
        - rules.use 항목은 뒷 순서부터 불러온다(chain 형태)
        - 공식문서: https://webpack.js.org/loaders/

</br>

- Output 설정  
    여러가지 Output 파일을 번들링 하기위한 설정

    - about.html, about.js 생성
        - about.html
            ```html
            <html>
                <body>
                    <h1>Hello, Webpack</h1>
                    <div id="root"></div>
                    <script src="./public/about.js"></script>
                    <a href="./index.html">index 이동</a>
                </body>
            </html>
            ```
        - about.js
            ```javascript
            import hello_word from "./hello.js";
            import world_word from "./world.js";
            import css from "./style.css";
            document.querySelector("#root").innerHTML = world_word + " " + hello_word;
            console.log("css", css);
            ```
        - webpack.config.js
            ```javascript
            module.exports = {
            mode: "development",
            entry: {
                index: "./source/index.js",
                about: "./source/about.js",
            },
            output: {
                path: path.resolve(__dirname, "public"),
                filename: "[name].js",
            },
            ```
        - entry 항목을 객체 형태로 선언하여 다수의 엔트리를 설정 가능
        - ouput 항목에서 [name] 템플릿을 활용하여 여러개의 entry를 번들링 가능
        - 공식문서: https://webpack.js.org/output/

</br>

- Plugin  
    WebPack을 사용하면 여러가지 확장 기능을 제공하는 Plugin을 쉽게 프로젝트에 적용하고 사용 가능하다.

    - html-webpack-plugin 적용
        - 플러그인 설치
            ```
            npm install --save-dev html-webpack-plugin
            ```
        - index.html, about.html 수정
            ```html
            <html>
                <body>
                    <h1>Hello, Webpack</h1>
                    <div id="root"></div>
                    <a href="./about.html">about 이동</a>
                </body>
            </html>
            <!-- 번들링된 script를 추가하는 구문을 삭제 -->
            ```
        - webpack.config.js
            ```javascript
            const HtmlWebpackPlugin = require("html-webpack-plugin");


            plugins: [
                new HtmlWebpackPlugin({
                template: "./source/index.html",
                filename: "index.html",
                chunks: "index", //entry name
                }),
                new HtmlWebpackPlugin({
                template: "./source/about.html",
                filename: "about.html",
                chunks: "about", //entry name
                }),
            ],
            ```
        - 로더와 다르게 플러그인은 플러그인 객체를 생성하는 명령을 통해 주입한다.
        - 인자를 통해 템플릿, 파일이름, 사용할 번들링된 entry 이름을 지정
        - HtmlWebpackPlugin을 통해 번들링된 소스를 추가시킨 html을 자동으로 생성할 수 있게되었다.  

<br/>
WebPack 기본기 학습 끝.


    


<br/><br/><br/><br/><br/><br/><br/><br/><br/>
plugin 에는 플러그인의 객체를 삽입
html 자동생성하고 번들링된 요소들을 자동으로 주입