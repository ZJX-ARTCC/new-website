<script>
	import Icon from '@iconify/svelte';
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { ChevronDownSolid, ChevronRightSolid } from 'flowbite-svelte-icons';
	import { page } from '$app/stores';
</script>
<div class="pl-4 inline-block align-middle">
	<a class="link-effect font-bold" href="/">
		<span class="text-xl text-stone-50">Jacksonville</span>
		<span class="text-xl text-sky-500"> ARTCC</span>
	</a>
</div>
<div class="space-x-16 pl-10 z-10">
	<Button class="text-lg text-stone-200 inline-flex align-middle"><Icon icon="mdi:airplane" class="w-7 h-7 pr-1.5"/> Pilots<ChevronDownSolid class="w-6 h-6 pt-1 pl-3"/></Button>
	<Dropdown>
		<DropdownItem class="bg-gray-700 text-stone-200 text-lg p-3 flex">
			<span>ARTCC Maps</span>
			<ChevronRightSolid class="w-5 h-5 pt-3"/>
		</DropdownItem>
		<Dropdown placement="right-start">
			<DropdownItem class="bg-gray-700 text-stone-200 text-lg p-3 inline-flex">
				<span class="pr-1">Center</span>
				<span>Split</span>
			</DropdownItem>
		</Dropdown>
		<DropdownItem class="bg-gray-700 text-stone-200 text-lg p-3 flex">
			<span>Flight Planning</span>
			<ChevronRightSolid class="w-5 h-5 pt-3"/>
		</DropdownItem>
	</Dropdown>
	<a href="/controllers" class="text-lg text-stone-200 inline-flex align-middle" id="index"><Icon icon="ri:radar-fill" class="pt-1.5 navbarIcon" /> Controllers</a>
	<Button class="text-lg text-stone-200 inline-flex align-middle"><Icon icon="ic:baseline-people" class="w-7 h-7 pr-1.5" />Membership<ChevronDownSolid class="w-6 h-6 pt-1 pl-3"/></Button>
	<Dropdown>
		
		<DropdownItem class="bg-gray-700 text-stone-200 text-lg p-3 flex">
			<a href="/roster"><span>Roster</span></a>
		</DropdownItem>
		<DropdownItem class="bg-gray-700 text-stone-200 text-lg p-3 flex">
			<a href="/staff"><span>ARTCC Staff</span></a>
		</DropdownItem>
		<DropdownItem class="bg-gray-700 text-stone-200 text-lg p-3 flex">
			<a href="/visit"><span>Become a Visitor</span></a>
		</DropdownItem>
		<DropdownItem class="bg-gray-700 text-stone-200 text-lg p-3 flex">
			<a href="/admin"><span>Admin</span></a>
		</DropdownItem>
		
	</Dropdown>
	<a href="/events" class="text-lg text-stone-200 inline-flex align-middle" id="index"><Icon icon="ion:calendar" class="pt-1.5 navbarIcon" /> Events</a>
	{#if $page.data.session != null}
		<a href="/profile/{$page.data.session.userId}" class="text-lg text-stone-200 inline-flex align-middle" id="index"><Icon icon="ic:baseline-person" class="pt-1.5 navbarIcon" />Profile</a>
	{:else}
		<a href="/login" class="text-lg text-stone-200 inline-flex align-middle" id="index"><Icon icon="ic:baseline-log-in" class="pt-1.5 navbarIcon" /> Login</a>
	{/if}
</div>