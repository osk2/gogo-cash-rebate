<template>
  <div class="container" id="app">
    <div class="row">
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

          <div class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
              <router-link to="/" tag="li"><a>首頁</a></router-link>
              <router-link to="/list" tag="li"><a>收錄通路</a></router-link>
            </ul>
            <ul class="nav navbar-nav navbar-right">
              <li><a href="https://github.com/osk2/gogo-cash-rebate" target="_blank">GitHub</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
    <router-view/>
  </div>
</template>