<script setup lang="ts">
import { enabledCities } from '../config/sites'

await navigateTo(`/${enabledCities[0]?.key || 'ccdata'}/`, { replace: true })
</script>
