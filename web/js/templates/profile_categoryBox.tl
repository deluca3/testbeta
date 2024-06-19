<div class="panel panel-default inlineScrollPanel" style="display: none;">
    <div class="panel-body">
        <ul class="nav nav-pills nav-stacked categorySelect">
            {#.:.}
                <li class="{@eq key=hasChildren value="1"}hasSubs{/eq}"><a data-catID="{id}" class="categoryLink" href="#">{name}</a></li>
            {/.}
        </ul>
    </div>
</div>