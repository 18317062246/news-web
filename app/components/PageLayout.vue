<script setup lang="ts">
import { footerCities } from '../config/sites'

defineProps<{ siteKey: string; brandMark: string; brandTitle: string; showSidebar?: boolean }>()
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <div class="site-header__inner">
        <a class="logo legacy-wordmark" href="#" aria-label="中原地产" @click.prevent>中原地产</a>
      </div>
    </header>
    <main class="page-layout" :class="{ 'page-layout--sidebar': showSidebar }">
      <div class="page-layout__main"><slot name="main" /></div>
      <aside v-if="showSidebar" class="page-layout__sidebar"><slot name="sidebar" /></aside>
    </main>
<!--    <footer class="site-footer">-->
<!--      <div class="site-footer__inner">-->
<!--        <div class="site-footer__pc">-->
<!--          <div class="site-footer__city-title">热门城市</div>-->
<!--          <nav class="site-footer__cities" aria-label="热门城市">-->
<!--            <a v-for="[code, name] in footerCities" :key="code" :href="`https://${code}.centanet.com/`" target="_blank" rel="noreferrer">{{ name }}中原</a>-->
<!--          </nav>-->
<!--          <div class="site-footer__legal">-->
<!--            本站所载各种成交信息和数据仅供参考，不构成任何投资建议；公司不对成交数据的准确性作出承诺，也不对任何错误负任何法律责任。所有合同均以最终签约为准。-->
<!--            <br>安全中介&nbsp;&nbsp;选中原&nbsp;Copyright ©2026 Centanet.com&nbsp;版权所有&nbsp;-->
<!--            <a href="https://beian.miit.gov.cn" target="_blank" rel="noreferrer">粤ICP备16080050号</a>&nbsp;-->
<!--            <a href="https://static.centanet.com/pcweb/test/20211230182121/images/licencephoto.jpg?v202112301" target="_blank" rel="noreferrer">增值电信业务经营许可证：合字B2-20210337</a>-->
<!--          </div>-->
<!--          <div class="site-footer__police"><img src="https://static.centanet.com/pcweb/test/20211230182121/images/police.png?v202112301" alt="">粤公网安备 44030502004627号</div>-->
<!--        </div>-->
<!--        <div class="site-footer__wap">开发者：中原（中国）房地产代理有限公司<br>中原地产研究院</div>-->
<!--      </div>-->
<!--    </footer>-->
    <footer class="site-footer">
      <div class="site-footer__inner">
        <div class="site-footer__pc">
          <div class="site-footer__city-title">热门城市</div>

          <nav class="site-footer__cities" aria-label="热门城市">
            <a
                v-for="[code, name] in footerCities"
                :key="code"
                :href="`https://${code}.centanet.com/`"
                target="_blank"
                rel="noreferrer"
            >
              {{ name }}中原
            </a>
          </nav>

          <div class="site-footer__legal">
            本站所载各种成交信息和数据仅供参考，不构成任何投资建议；公司不对成交数据的准确性作出承诺，也不对任何错误负任何法律责任。所有合同均以最终签约为准。
            <br>
            安全中介&nbsp;&nbsp;选中原&nbsp;Copyright ©2026 Centanet.com&nbsp;版权所有&nbsp;
            <a href="https://beian.miit.gov.cn" target="_blank" rel="noreferrer">
              粤ICP备16080050号
            </a>
            &nbsp;
            <a
                href="https://static.centanet.com/pcweb/test/20211230182121/images/licencephoto.jpg?v20211230182121"
                target="_blank"
                rel="noreferrer"
            >
              增值电信业务经营许可证：合字B2-20210337
            </a>
          </div>

          <div class="site-footer__police">
            <a
                href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030502004627"
                target="_blank"
                rel="noreferrer"
            >
              <img
                  src="https://static.centanet.com/pcweb/test/20211230182121/images/police.png?v20211230182121"
                  alt=""
              >
              粤公网安备 44030502004627号
            </a>
          </div>

          <div class="site-footer__infotxt">
            <img
                class="site-footer__brand-logo"
                src="https://static.centanet.com/news/2023042075/6/20231020/pc/images/zyzflogo.png"
                alt=""
            >

            <img
                class="site-footer__qr"
                src="https://static.centanet.com/news/2023042075/6/20231020/pc/images/twocodeimg.jpg"
                alt="中原找房二维码"
                width="60"
                height="60"
            >

            <div class="site-footer__appinfo">
              <span>APP名称：中原找房　版本号：7.48.6　更新：2026年10月09日</span>
              <span>开发运营商：中原（中国）房地产代理有限公司</span>
              <span>
            <a href="https://static.centanet.com/agreement/privacy.html" target="_blank" rel="noreferrer">
              隐私政策
            </a>
            <a href="https://static.centanet.com/agreement/authority.html" target="_blank" rel="noreferrer">
              权限列表
            </a>
            <a href="https://static.centanet.com/agreement/product.html" target="_blank" rel="noreferrer">
              产品功能
            </a>
          </span>
            </div>
          </div>
        </div>

        <div class="site-footer__wap">
          开发者：中原（中国）房地产代理有限公司<br>
          中原地产研究院
        </div>
      </div>
    </footer>
  </div>
</template>
