Array::unique = ->
  output = {}
  output[@[key]] = @[key] for key in [0...@length]
  value for key, value of output

Array::flatten = ->
  [].concat @...

model = (->
  json = null
  $.ajax
    async: false
    global: false
    url: "data/model.json"
    dataType: "json"
    success: (data) ->
      json = data

  json
)()

alphabet = "abcdefghijklmnopqrstuvwxyz"

edits1 = (word) ->
  splits = ([word.slice(0,i),word.slice(i)] for i in [0..word.length])
  deletes = (a[0] + a[1].slice(1) for a in splits when a[1])
  transposes = (a[0] + a[1][1] + a[1][0] + a[1].slice(2) for a in splits when a[1].length > 1)
  replaces = ((a[0] + c + a[1].slice(1) for a in splits when a[1].length > 0) for c in alphabet).flatten()
  inserts = ((a[0] + c + a[1] for a in splits) for c in alphabet).flatten()
  [deletes,transposes,replaces,inserts].flatten().unique()


known_edits2 = (word) ->
  result = ((e2 for e1 in edits1(word) when e2 of model) for e2 in edits1(e1)).flatten().unique()
  if result.length < 1
    null
  else
    result

known = (words) ->
  result = (w for w in words when w of model).unique()
  if result.length < 1
    null
  else
    result

@correct = (word) ->
  candidates = known([word]) or known(edits1(word)) or known_edits2(word) or [word]
  maxv = ["",0]
  for w in candidates
    if model[w] > maxv[1]
      maxv[0] = w
      maxv[1] = model[w]
  maxv[0]

