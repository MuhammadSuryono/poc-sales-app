export default defineNuxtRouteMiddleware((to) => {
    const defaultTitle = 'Sinau';

    useHead({
        title: `${defaultTitle} ${to?.meta?.name ?? ''}` || defaultTitle
    })
})