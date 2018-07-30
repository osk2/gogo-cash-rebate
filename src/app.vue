<template>
  <div class="container main">
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="/">@GoGo 回饋計算機</a>
        </div>

        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav">
            <li class="active"><router-link to="/">首頁</router-link></li>
            <li><router-link to="/list">收錄通路</router-link></li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li><a href="https://github.com/osk2/gogo-cash-rebate" target="_blank">GitHub</a></li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="row app">
      <router-view/>
    </div>
  </div>
</template>