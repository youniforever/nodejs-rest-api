var bbs = (function() {
	var _ = {};

	_.list = function() {
		$.get('http://localhost:8080/api/bbs', function(res) {
			if (res == null || res.result != 200) {
				throw new Error('게시판 목록을 불러오는데 실패했습니다.');
			}

			var bbsList = [];
			$.each(res.data, function(seq, row) {
				bbsList.push('<tr>');
				bbsList.push('<td><input type="checkbox" class="chkOne" bbsId="' + row.bbs_id + '" /></td>');
				bbsList.push('<td>' + row.bbs_id + '</td>');
				bbsList.push('<td>' + row.title + '</td>');
				bbsList.push('<td>' + row.content + '</td>');
				bbsList.push('<td>' + row.create_id + '</td>');
				bbsList.push('<td>' + row.create_date + '</td>');
				bbsList.push('<td>' + row.update_id + '</td>');
				bbsList.push('<td>' + row.update_date + '</td>');
				bbsList.push('</tr>');
			});
			$(".tblBbs > tbody").html(bbsList.join(''));
	    });
	};

	_.insert = function() {
		$.ajax({
			url: 'http://localhost:8080/api/bbs',
			type: 'put',
			data: {
				title: '제목###',
				content: '내용 ###'
			},
			success: function(rs) {
				bbs.list();
			}
		});
	};

	_.update = function(bbsIds) {
		if (bbsIds == null || bbsIds.length == 0) {
			alert('선택된 게시글이 없습니다.');
			throw new Error('선택된 게시글이 없습니다.');
		}

		$.ajax({
			url: 'http://localhost:8080/api/bbs',
			type: 'patch',
			data: {
				bbs_id: bbsIds.join(),
				title: '[수정] 제목',
				content: '[수정] 내용'
			},
			success: function(rs) {
				if (rs.result != 200) {
					alert(rs.data);
					return;
				}
				bbs.list();
			}
		});
	};

	_.delete = function(bbsIds) {
		if (bbsIds == null || bbsIds.length == 0) {
			alert('선택된 게시글이 없습니다.');
			throw new Error('선택된 게시글이 없습니다.');
		}

		$.ajax({
			url: 'http://localhost:8080/api/bbs',
			type: 'delete',
			data: {
				bbs_id: bbsIds.join()
			},
			success: function(rs) {
				if (rs.result != 200) {
					alert(rs.data);
					return;
				}
				bbs.list();
			}
		});
	};

	_.getCheckedId = function() {
		var res = [];
		var bbsIdArray = $(".chkOne:checked").map(function(){return $(this).attr('bbsId')});
		if ( bbsIdArray != null && bbsIdArray.length > 0 ) {
			for ( var i = 0; i < bbsIdArray.length; i ++ ) {
				res.push(bbsIdArray[i]);
			}
		}
		return res;
	};

	return _;
}());


bbs.list();

$(document).ready(function() {
	$(".chkAll").click(function() {
		$(".chkOne").prop("checked", $(this).prop("checked"));
	});
	$(".btnBbsInsert").click(function() {
		bbs.insert();
	});
	$(".btnBbsUpdate").click(function() {
		bbs.update(bbs.getCheckedId());

		$(".chkAll, .chkOne").prop("checked", false);
	});
	$(".btnBbsDelete").click(function() {
		bbs.delete(bbs.getCheckedId());

		$(".chkAll, .chkOne").prop("checked", false);
	});
});