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

webpack 기본설정 - 파일이 어떻게 합쳐지는가?
main.js 에서의 import = package.json 에서 명시한 vue를 가져옴
.vue 파일은 무었인가?
