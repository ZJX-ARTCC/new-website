<script>
	import '$lib/app.css';
	import Icon from '@iconify/svelte';
	import Card from '$lib/components/Card.svelte';
	import ATCCard from '$lib/components/ATCCard.svelte';

	const today = new Date();
	/** @type {{data: any}} */
	let { data } = $props();
	const pageData = data.pageData;
	const currentMonthName = today.toLocaleString('en-US', { month: 'long' });
</script>

<svelte:head>
	<title>Jacksonville ARTCC</title>
</svelte:head>

<header class="bg-gray-700 block" id="myTopnav">
	<div
		style="background-position: 0% 50%; background-size: cover; background-image: url('/KJAXNIGHT.png'); left: 0; top: 0; height: 560px; "
	>
		<div
			class="w-full flex flex-col justify-center items-center container text-center m-auto p-[5rem]"
		>
			<img src="/ZJX-Light-Logo.png" height="200" width="200" alt="" srcset="" />
			<h1 class="text-6xl text-white font-bold pt-3">Welcome to Jacksonville!</h1>
			<h3 class="text-3xl text-white pt-3">Part of VATUSA and VATSIM</h3>
		</div>
	</div>
</header>

<div class="flex flex-wrap justify-center mt-10 mb-5">
	<Card
		title="Top Controller of {currentMonthName}"
		subtext="{pageData.stats[0].firstName} {pageData.stats[0].lastName}"
		timestamp="{pageData.stats[0].hours} HOURS"
		icon="ant-design:hourglass-twotone"
	/>
	<Card
		title="Next Event"
		subtext={pageData.events[0].name}
		timestamp={pageData.events[0].start.toLocaleString(undefined, {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			timeZoneName: 'short'
		})}
		icon="ion:calendar"
	/>
	<Card
		title="Newest Home Controller"
		subtext="{pageData.newControllers[0].firstName} {pageData.newControllers[0].lastName} ({pageData
			.newControllers[0].rating})"
		timestamp="Joined {pageData.newControllers[0].joined.toLocaleString(undefined, {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		})}"
		icon="material-symbols:person"
	/>
</div>
<main class="container mx-auto p-4">
	<section class="my-6">
		<section class="my-6">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="bg-white shadow p-4" style="width: auto;">
					<h3 class="font-semibold mb-2">Upcoming Events</h3>
					<div class="table-responsive">
						{#each pageData.events as event}
							<tr style="background-color: rgba(255, 255, 255);">
								<td style="width: 50%;" align="left">
									<a href="/events/{event.id}/">
										<img loading="lazy" width="100%" src={event.banner} alt={event.name} />
									</a>
								</td>
								<td style="width: 50%;">
									<a href="/events/{event.id}/">
										<div style="text-align:center; font-size: 24px;">
											<b>{event.name}</b>
										</div>
									</a>
									<div style="text-align:center; font-size: 20px;">Hosted by: {event.host}</div>
									<br />
									<div style="text-align:center; font-size: 20px;">
										{event.start.toLocaleString(undefined, {
											month: 'short',
											day: 'numeric',
											year: 'numeric',
											hour: 'numeric',
											minute: 'numeric',
											timeZoneName: 'short'
										})}
									</div>
								</td>
							</tr>
							<tr>
								<td colspan="2">&nbsp;</td>
							</tr>
						{/each}
					</div>
				</div>
				<div class="bg-white shadow p-4">
					<h3 class="font-semibold mb-2">Online Controllers</h3>
					<table style="border-spacing: 0; border-collapse: collapse; width: 100%;" class="mt-9">
						<tbody>
							{#if pageData.online.length > 0}
								{#each pageData.online as onlineController}
									<ATCCard
										name={onlineController.callsign}
										position="Online Since:"
										startDate="{onlineController.firstName} {onlineController.lastName}"
										endDate={onlineController.logon.toLocaleString(undefined, {
											month: 'short',
											day: 'numeric',
											hour: 'numeric',
											minute: 'numeric',
											timeZoneName: 'short'
										})}
									/>
								{/each}
							{:else}
								<tr>
									<td colspan="2" class="text-center">No controllers online at this time.</td>
								</tr>
							{/if}
						</tbody>
					</table>
				</div>
				<div class="bg-white shadow p-4">
					<h3 class="font-semibold mb-2">Welcome Our Newest Home Controllers</h3>
					<table style="border-spacing: 0; border-collapse: collapse; width: 100%;" class="mt-9">
						<tbody>
							{#each pageData.newControllers as controller}
								<ATCCard
									name="{controller.firstName} {controller.lastName} ({controller.rating})"
									position="Joined ZJX on:"
									startDate=""
									endDate={controller.joined.toLocaleString(undefined, {
										month: 'long',
										day: 'numeric',
										year: 'numeric'
									})}
								/>
							{/each}
						</tbody>
					</table>
				</div>
				<div class="bg-white shadow p-4">
					<h3 class="font-semibold mb-2">This Month's Stats</h3>
					<div class="flex flex-col items-center">
						<div class="text-xl font-bold text-blue-600 mr-2">Hours Controlled This Month:</div>
						<div class="font-bold text-gray-800 mr-2 text-right">{pageData.totalHours}</div>
					</div>
					<div class="flex flex-col items-center">
						<div class="text-yellow-500 text-left">★★★</div>
						<div class="font-bold text-gray-800 mr-2 text-right">
							{pageData.stats[0].firstName}
							{pageData.stats[0].lastName}
						</div>
						<div class="text-gray-800 mr-2 text-right">{pageData.stats[0].hours} hours</div>
						<br />
						<span class="text-gray-500">★★</span>
						<div class="font-bold text-gray-800 mr-2">
							{pageData.stats[1].firstName}
							{pageData.stats[1].lastName}
						</div>
						<div class="text-gray-800 mr-2 text-right">{pageData.stats[1].hours} hours</div>
						<br />
						<span class="text-red-500">★</span>
						<div class="font-bold text-gray-800 mr-2">
							{pageData.stats[2].firstName}
							{pageData.stats[2].lastName}
						</div>
						<div class="text-gray-800 mr-2 text-right">{pageData.stats[2].hours} hours</div>
					</div>
				</div>
			</div>
		</section>
	</section>
</main>

<div
	class="bg-image"
	style="background-image: url('/orl_aerial.jpg'); background-color: #f8f9fa; background-position: 0 50%; background-size: cover;"
>
	<div
		class="block-content block-content-full bg-primary-dark-op text-center"
		style="padding-bottom: 18px; background-color: rgba(52, 58, 64, .8) !important; transition: opacity .2s ease-out; margin: 0 auto; padding: 18px 18px 1px; width: 100%; overflow-x: visible; text-align: center !important;"
	>
		<div class="py-[30px] js-appear-enabled animated fadeIn" data-toggle="appear">
			<div class="justify-content-center py-[10px]">
				<div class="iconStar">
					<div class="font-w700 text-white pb-[10px] flex flex-row justify-center m-auto">
						<Icon icon="material-symbols:star" color="#fc0" />
						<Icon icon="material-symbols:star" color="#fc0" />
						<Icon icon="material-symbols:star" color="#fc0" />
						<Icon icon="material-symbols:star" color="#fc0" />
						<Icon icon="material-symbols:star" color="#fc0" />
					</div>
					<h3 class="font-bold text-3xl text-white mb-[20px]">
						Give our controllers some words of praise.
					</h3>
					<a
						class="btn btn-hero btn-noborder btn-rounded btn-primary mb-10 items-center justify-center gap-2 js-appear-enabled animated fadeInUp"
						data-toggle="appear"
						data-class="animated fadeInUp"
						href="/feedback/"
					>
						<Icon icon="tabler:pencil" class="inline-block text-lg" /> Provide Feedback
					</a>
				</div>
			</div>
		</div>
	</div>
</div>